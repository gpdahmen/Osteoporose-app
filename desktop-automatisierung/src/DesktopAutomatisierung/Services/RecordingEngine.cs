using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Automation;
using DesktopAutomatisierung.Helpers;
using DesktopAutomatisierung.Models;

namespace DesktopAutomatisierung.Services;

/// <summary>
/// Engine zum Aufzeichnen von Maus-, Tastatur- und UI-Automation-Aktionen.
/// Verwendet Low-Level Windows-Hooks für globale Eingabeerfassung
/// und die UI Automation API für Elementidentifikation.
/// </summary>
public class RecordingEngine : IDisposable
{
    private IntPtr _mouseHookHandle;
    private IntPtr _keyboardHookHandle;
    private NativeMethods.HookProc? _mouseProc;
    private NativeMethods.HookProc? _keyboardProc;

    private readonly List<RecordedAction> _actions = new();
    private DateTime _lastActionTime;
    private bool _isRecording;
    private bool _isPaused;
    private readonly object _lock = new();

    // Einstellungen
    public bool RecordMouseMoves { get; set; } = false;
    public bool RecordUIElements { get; set; } = true;
    public bool CaptureScreenshots { get; set; } = false;
    public int MinMouseMoveDistance { get; set; } = 20;
    public int MouseMoveThrottleMs { get; set; } = 100;
    private int _lastMouseX, _lastMouseY;
    private DateTime _lastMouseMoveTime;

    // Text-Eingabe-Puffer
    private readonly List<char> _textBuffer = new();
    private DateTime _lastKeyTime;
    private const int TextBufferFlushMs = 500;

    public event EventHandler<RecordedAction>? ActionRecorded;
    public event EventHandler? RecordingStarted;
    public event EventHandler? RecordingStopped;
    public event EventHandler? RecordingPaused;
    public event EventHandler? RecordingResumed;

    public bool IsRecording => _isRecording;
    public bool IsPaused => _isPaused;
    public IReadOnlyList<RecordedAction> Actions => _actions.AsReadOnly();

    public void StartRecording()
    {
        if (_isRecording) return;

        _actions.Clear();
        _lastActionTime = DateTime.Now;
        _isRecording = true;
        _isPaused = false;

        InstallHooks();
        RecordingStarted?.Invoke(this, EventArgs.Empty);
    }

    public void StopRecording()
    {
        if (!_isRecording) return;

        FlushTextBuffer();
        RemoveHooks();
        _isRecording = false;
        _isPaused = false;

        RecordingStopped?.Invoke(this, EventArgs.Empty);
    }

    public void PauseRecording()
    {
        if (!_isRecording || _isPaused) return;
        FlushTextBuffer();
        _isPaused = true;
        RecordingPaused?.Invoke(this, EventArgs.Empty);
    }

    public void ResumeRecording()
    {
        if (!_isRecording || !_isPaused) return;
        _lastActionTime = DateTime.Now;
        _isPaused = false;
        RecordingResumed?.Invoke(this, EventArgs.Empty);
    }

    public List<RecordedAction> GetRecordedActions()
    {
        lock (_lock)
        {
            return new List<RecordedAction>(_actions);
        }
    }

    private void InstallHooks()
    {
        var moduleHandle = NativeMethods.GetModuleHandle(Process.GetCurrentProcess().MainModule?.ModuleName);

        _mouseProc = MouseHookCallback;
        _mouseHookHandle = NativeMethods.SetWindowsHookEx(
            NativeMethods.WH_MOUSE_LL, _mouseProc, moduleHandle, 0);

        _keyboardProc = KeyboardHookCallback;
        _keyboardHookHandle = NativeMethods.SetWindowsHookEx(
            NativeMethods.WH_KEYBOARD_LL, _keyboardProc, moduleHandle, 0);
    }

    private void RemoveHooks()
    {
        if (_mouseHookHandle != IntPtr.Zero)
        {
            NativeMethods.UnhookWindowsHookEx(_mouseHookHandle);
            _mouseHookHandle = IntPtr.Zero;
        }
        if (_keyboardHookHandle != IntPtr.Zero)
        {
            NativeMethods.UnhookWindowsHookEx(_keyboardHookHandle);
            _keyboardHookHandle = IntPtr.Zero;
        }
    }

    private IntPtr MouseHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && _isRecording && !_isPaused)
        {
            var hookStruct = Marshal.PtrToStructure<NativeMethods.MSLLHOOKSTRUCT>(lParam);
            int msg = wParam.ToInt32();

            switch (msg)
            {
                case NativeMethods.WM_LBUTTONDOWN:
                    FlushTextBuffer();
                    RecordMouseClick(hookStruct, MouseButton.Left, ActionType.MouseClick);
                    break;
                case NativeMethods.WM_LBUTTONDBLCLK:
                    FlushTextBuffer();
                    RecordMouseClick(hookStruct, MouseButton.Left, ActionType.MouseDoubleClick);
                    break;
                case NativeMethods.WM_RBUTTONDOWN:
                    FlushTextBuffer();
                    RecordMouseClick(hookStruct, MouseButton.Right, ActionType.MouseRightClick);
                    break;
                case NativeMethods.WM_MOUSEWHEEL:
                    FlushTextBuffer();
                    RecordMouseScroll(hookStruct);
                    break;
                case NativeMethods.WM_MOUSEMOVE when RecordMouseMoves:
                    RecordMouseMove(hookStruct);
                    break;
            }
        }

        return NativeMethods.CallNextHookEx(_mouseHookHandle, nCode, wParam, lParam);
    }

    private IntPtr KeyboardHookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
        if (nCode >= 0 && _isRecording && !_isPaused)
        {
            var hookStruct = Marshal.PtrToStructure<NativeMethods.KBDLLHOOKSTRUCT>(lParam);
            int msg = wParam.ToInt32();

            if (msg == NativeMethods.WM_KEYDOWN || msg == NativeMethods.WM_SYSKEYDOWN)
            {
                ProcessKeyDown(hookStruct);
            }
        }

        return NativeMethods.CallNextHookEx(_keyboardHookHandle, nCode, wParam, lParam);
    }

    private void RecordMouseClick(NativeMethods.MSLLHOOKSTRUCT hookStruct, MouseButton button, ActionType type)
    {
        var action = CreateBaseAction(type);
        action.X = hookStruct.pt.x;
        action.Y = hookStruct.pt.y;
        action.Button = button;

        // UI-Automation-Element am Klickpunkt identifizieren
        if (RecordUIElements)
        {
            EnrichWithUIAutomation(action, hookStruct.pt.x, hookStruct.pt.y);
        }

        // Fenster-Informationen
        var hWnd = NativeMethods.GetForegroundWindow();
        action.WindowTitle = NativeMethods.GetWindowTitle(hWnd);
        action.ProcessName = NativeMethods.GetProcessNameForWindow(hWnd);
        action.ClassName = NativeMethods.GetWindowClassName(hWnd);

        AddAction(action);
    }

    private void RecordMouseScroll(NativeMethods.MSLLHOOKSTRUCT hookStruct)
    {
        var action = CreateBaseAction(ActionType.MouseScroll);
        action.X = hookStruct.pt.x;
        action.Y = hookStruct.pt.y;
        action.ScrollDelta = (short)(hookStruct.mouseData >> 16);
        AddAction(action);
    }

    private void RecordMouseMove(NativeMethods.MSLLHOOKSTRUCT hookStruct)
    {
        var now = DateTime.Now;
        int dx = hookStruct.pt.x - _lastMouseX;
        int dy = hookStruct.pt.y - _lastMouseY;
        double dist = Math.Sqrt(dx * dx + dy * dy);

        if (dist < MinMouseMoveDistance || (now - _lastMouseMoveTime).TotalMilliseconds < MouseMoveThrottleMs)
            return;

        var action = CreateBaseAction(ActionType.MouseMove);
        action.X = hookStruct.pt.x;
        action.Y = hookStruct.pt.y;
        AddAction(action);

        _lastMouseX = hookStruct.pt.x;
        _lastMouseY = hookStruct.pt.y;
        _lastMouseMoveTime = now;
    }

    private void ProcessKeyDown(NativeMethods.KBDLLHOOKSTRUCT hookStruct)
    {
        bool ctrl = (NativeMethods.GetAsyncKeyState(NativeMethods.VK_CONTROL) & 0x8000) != 0;
        bool alt = (NativeMethods.GetAsyncKeyState(NativeMethods.VK_MENU) & 0x8000) != 0;
        bool shift = (NativeMethods.GetAsyncKeyState(NativeMethods.VK_SHIFT) & 0x8000) != 0;
        bool win = (NativeMethods.GetAsyncKeyState(NativeMethods.VK_LWIN) & 0x8000) != 0;

        var keyName = ((System.Windows.Input.Key)System.Windows.Input.KeyInterop.KeyFromVirtualKey(hookStruct.vkCode)).ToString();

        // Modifikatortasten allein nicht aufzeichnen
        if (hookStruct.vkCode is NativeMethods.VK_CONTROL or NativeMethods.VK_MENU
            or NativeMethods.VK_SHIFT or NativeMethods.VK_LWIN or 0xA0 or 0xA1 or 0xA2 or 0xA3 or 0xA4 or 0xA5)
            return;

        // Tastenkombination mit Modifikator
        if (ctrl || alt || win)
        {
            FlushTextBuffer();
            var action = CreateBaseAction(ActionType.KeyCombination);
            action.KeyCode = hookStruct.vkCode;
            action.KeyName = keyName;
            action.ModifierCtrl = ctrl;
            action.ModifierAlt = alt;
            action.ModifierShift = shift;
            action.ModifierWin = win;

            var hWnd = NativeMethods.GetForegroundWindow();
            action.WindowTitle = NativeMethods.GetWindowTitle(hWnd);
            action.ProcessName = NativeMethods.GetProcessNameForWindow(hWnd);

            AddAction(action);
            return;
        }

        // Druckbare Zeichen in Textpuffer sammeln
        if (IsPrintableKey(hookStruct.vkCode) && !ctrl && !alt && !win)
        {
            char c = VirtualKeyToChar(hookStruct.vkCode, shift);
            if (c != '\0')
            {
                _textBuffer.Add(c);
                _lastKeyTime = DateTime.Now;
                return;
            }
        }

        // Sondertasten (Enter, Tab, Escape, F-Tasten etc.)
        FlushTextBuffer();
        var keyAction = CreateBaseAction(ActionType.KeyPress);
        keyAction.KeyCode = hookStruct.vkCode;
        keyAction.KeyName = keyName;
        keyAction.ModifierShift = shift;

        var hwnd = NativeMethods.GetForegroundWindow();
        keyAction.WindowTitle = NativeMethods.GetWindowTitle(hwnd);
        keyAction.ProcessName = NativeMethods.GetProcessNameForWindow(hwnd);

        AddAction(keyAction);
    }

    private void FlushTextBuffer()
    {
        if (_textBuffer.Count == 0) return;

        var text = new string(_textBuffer.ToArray());
        _textBuffer.Clear();

        var action = CreateBaseAction(ActionType.TextInput);
        action.Text = text;

        var hWnd = NativeMethods.GetForegroundWindow();
        action.WindowTitle = NativeMethods.GetWindowTitle(hWnd);
        action.ProcessName = NativeMethods.GetProcessNameForWindow(hWnd);

        AddAction(action);
    }

    private void EnrichWithUIAutomation(RecordedAction action, int x, int y)
    {
        try
        {
            var point = new System.Windows.Point(x, y);
            var element = AutomationElement.FromPoint(point);
            if (element != null)
            {
                action.AutomationId = element.Current.AutomationId;
                action.ControlName = element.Current.Name;
                action.ControlType = element.Current.ControlType?.ProgrammaticName;
                action.ClassName = string.IsNullOrEmpty(action.ClassName)
                    ? element.Current.ClassName
                    : action.ClassName;
            }
        }
        catch
        {
            // UI Automation kann bei manchen Elementen fehlschlagen – ignorieren
        }
    }

    private RecordedAction CreateBaseAction(ActionType type)
    {
        var now = DateTime.Now;
        var delay = (int)(now - _lastActionTime).TotalMilliseconds;

        return new RecordedAction
        {
            Type = type,
            Timestamp = now,
            DelayMs = Math.Max(0, delay)
        };
    }

    private void AddAction(RecordedAction action)
    {
        lock (_lock)
        {
            _actions.Add(action);
            _lastActionTime = action.Timestamp;
        }

        ActionRecorded?.Invoke(this, action);
    }

    private static bool IsPrintableKey(int vkCode)
    {
        // A-Z, 0-9, Leerzeichen, OEM-Tasten
        return (vkCode >= 0x30 && vkCode <= 0x5A) ||
               (vkCode >= 0xBA && vkCode <= 0xE2) ||
               vkCode == 0x20; // Space
    }

    private static char VirtualKeyToChar(int vkCode, bool shift)
    {
        if (vkCode >= 0x41 && vkCode <= 0x5A) // A-Z
            return shift ? (char)vkCode : (char)(vkCode + 32);
        if (vkCode >= 0x30 && vkCode <= 0x39) // 0-9
            return (char)vkCode;
        if (vkCode == 0x20) return ' ';
        return '\0';
    }

    public void Dispose()
    {
        StopRecording();
        GC.SuppressFinalize(this);
    }
}
