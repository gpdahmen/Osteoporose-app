using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Windows.Automation;
using DesktopAutomatisierung.Helpers;
using DesktopAutomatisierung.Models;

namespace DesktopAutomatisierung.Services;

/// <summary>
/// Engine zur Wiedergabe aufgezeichneter Aktionen.
/// Unterstützt sowohl koordinatenbasierte als auch UI-Automation-basierte Wiedergabe.
/// </summary>
public class PlaybackEngine
{
    private CancellationTokenSource? _cts;
    private bool _isPlaying;
    private bool _isPaused;
    private readonly ManualResetEventSlim _pauseEvent = new(true);

    public float SpeedMultiplier { get; set; } = 1.0f;
    public bool PreferUIAutomation { get; set; } = true;
    public bool StopOnError { get; set; } = true;

    public event EventHandler<RecordedAction>? ActionStarting;
    public event EventHandler<RecordedAction>? ActionCompleted;
    public event EventHandler<(RecordedAction Action, Exception Error)>? ActionFailed;
    public event EventHandler? PlaybackStarted;
    public event EventHandler<bool>? PlaybackFinished; // true = success
    public event EventHandler<int>? ProgressChanged; // Aktueller Schritt-Index

    public bool IsPlaying => _isPlaying;
    public bool IsPaused => _isPaused;

    public async Task PlayAsync(IReadOnlyList<RecordedAction> actions,
        Dictionary<string, string>? parameters = null, CancellationToken externalToken = default)
    {
        if (_isPlaying) throw new InvalidOperationException("Wiedergabe läuft bereits.");

        _cts = CancellationTokenSource.CreateLinkedTokenSource(externalToken);
        _isPlaying = true;
        _isPaused = false;
        _pauseEvent.Set();
        bool success = true;

        PlaybackStarted?.Invoke(this, EventArgs.Empty);

        try
        {
            for (int i = 0; i < actions.Count; i++)
            {
                _cts.Token.ThrowIfCancellationRequested();
                _pauseEvent.Wait(_cts.Token);

                var action = actions[i];

                // Parameter-Substitution
                if (parameters != null)
                    action = SubstituteParameters(action, parameters);

                // Verzögerung
                int delay = (int)(action.DelayMs / SpeedMultiplier);
                if (delay > 0)
                    await Task.Delay(Math.Min(delay, 30000), _cts.Token);

                ProgressChanged?.Invoke(this, i);
                ActionStarting?.Invoke(this, action);

                try
                {
                    await ExecuteActionAsync(action, _cts.Token);
                    ActionCompleted?.Invoke(this, action);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    ActionFailed?.Invoke(this, (action, ex));

                    if (action.ContinueOnError) continue;
                    if (StopOnError)
                    {
                        success = false;
                        break;
                    }
                }
            }
        }
        catch (OperationCanceledException)
        {
            success = false;
        }
        finally
        {
            _isPlaying = false;
            _isPaused = false;
            PlaybackFinished?.Invoke(this, success);
        }
    }

    public void Pause()
    {
        if (_isPlaying && !_isPaused)
        {
            _isPaused = true;
            _pauseEvent.Reset();
        }
    }

    public void Resume()
    {
        if (_isPlaying && _isPaused)
        {
            _isPaused = false;
            _pauseEvent.Set();
        }
    }

    public void Stop()
    {
        _cts?.Cancel();
        _pauseEvent.Set(); // Falls pausiert, aufwecken damit Cancel wirkt
    }

    private async Task ExecuteActionAsync(RecordedAction action, CancellationToken ct)
    {
        switch (action.Type)
        {
            case ActionType.MouseClick:
                await ExecuteMouseClick(action);
                break;
            case ActionType.MouseDoubleClick:
                await ExecuteMouseDoubleClick(action);
                break;
            case ActionType.MouseRightClick:
                await ExecuteMouseRightClick(action);
                break;
            case ActionType.MouseScroll:
                ExecuteMouseScroll(action);
                break;
            case ActionType.MouseMove:
                MoveMouse(action.X, action.Y);
                break;
            case ActionType.KeyPress:
                ExecuteKeyPress(action);
                break;
            case ActionType.KeyCombination:
                ExecuteKeyCombination(action);
                break;
            case ActionType.TextInput:
                await ExecuteTextInput(action);
                break;
            case ActionType.UIElementClick:
                ExecuteUIElementClick(action);
                break;
            case ActionType.UIElementSetValue:
                ExecuteUIElementSetValue(action);
                break;
            case ActionType.UIElementSelect:
                ExecuteUIElementSelect(action);
                break;
            case ActionType.WindowActivate:
                ActivateWindow(action);
                break;
            case ActionType.WindowClose:
                CloseWindow(action);
                break;
            case ActionType.Wait:
                await Task.Delay(action.DelayMs, ct);
                break;
            case ActionType.WaitForElement:
                await WaitForElement(action, ct);
                break;
            case ActionType.WaitForWindow:
                await WaitForWindow(action, ct);
                break;
        }
    }

    private async Task ExecuteMouseClick(RecordedAction action)
    {
        // Versuche zunächst UI-Automation, dann Koordinaten
        if (PreferUIAutomation && TryUIAutomationClick(action))
            return;

        MoveMouse(action.X, action.Y);
        await Task.Delay(50);
        SendMouseClick(NativeMethods.MOUSEEVENTF_LEFTDOWN, NativeMethods.MOUSEEVENTF_LEFTUP);
    }

    private async Task ExecuteMouseDoubleClick(RecordedAction action)
    {
        if (PreferUIAutomation && TryUIAutomationClick(action))
            return;

        MoveMouse(action.X, action.Y);
        await Task.Delay(50);
        SendMouseClick(NativeMethods.MOUSEEVENTF_LEFTDOWN, NativeMethods.MOUSEEVENTF_LEFTUP);
        await Task.Delay(60);
        SendMouseClick(NativeMethods.MOUSEEVENTF_LEFTDOWN, NativeMethods.MOUSEEVENTF_LEFTUP);
    }

    private async Task ExecuteMouseRightClick(RecordedAction action)
    {
        MoveMouse(action.X, action.Y);
        await Task.Delay(50);
        SendMouseClick(NativeMethods.MOUSEEVENTF_RIGHTDOWN, NativeMethods.MOUSEEVENTF_RIGHTUP);
    }

    private void ExecuteMouseScroll(RecordedAction action)
    {
        MoveMouse(action.X, action.Y);

        var input = new NativeMethods.INPUT
        {
            type = NativeMethods.INPUT_MOUSE,
            U = new NativeMethods.INPUTUNION
            {
                mi = new NativeMethods.MOUSEINPUT
                {
                    dwFlags = NativeMethods.MOUSEEVENTF_WHEEL,
                    mouseData = action.ScrollDelta
                }
            }
        };

        NativeMethods.SendInput(1, new[] { input }, Marshal.SizeOf<NativeMethods.INPUT>());
    }

    private void ExecuteKeyPress(RecordedAction action)
    {
        SendKey((ushort)action.KeyCode, false);
        SendKey((ushort)action.KeyCode, true);
    }

    private void ExecuteKeyCombination(RecordedAction action)
    {
        var modifiers = new List<ushort>();
        if (action.ModifierCtrl) modifiers.Add(NativeMethods.VK_CONTROL);
        if (action.ModifierAlt) modifiers.Add(NativeMethods.VK_MENU);
        if (action.ModifierShift) modifiers.Add(NativeMethods.VK_SHIFT);
        if (action.ModifierWin) modifiers.Add(NativeMethods.VK_LWIN);

        // Modifikatoren drücken
        foreach (var mod in modifiers)
            SendKey(mod, false);

        // Haupttaste
        SendKey((ushort)action.KeyCode, false);
        SendKey((ushort)action.KeyCode, true);

        // Modifikatoren loslassen
        modifiers.Reverse();
        foreach (var mod in modifiers)
            SendKey(mod, true);
    }

    private async Task ExecuteTextInput(RecordedAction action)
    {
        if (string.IsNullOrEmpty(action.Text)) return;

        // Versuche UI-Automation ValuePattern
        if (PreferUIAutomation && !string.IsNullOrEmpty(action.AutomationId))
        {
            try
            {
                var element = FindUIElement(action);
                if (element != null && element.TryGetCurrentPattern(ValuePattern.Pattern, out var pattern))
                {
                    ((ValuePattern)pattern).SetValue(action.Text);
                    return;
                }
            }
            catch { /* Fallback zu SendKeys */ }
        }

        // Zeichen einzeln senden
        foreach (char c in action.Text)
        {
            var inputs = new NativeMethods.INPUT[]
            {
                new()
                {
                    type = NativeMethods.INPUT_KEYBOARD,
                    U = new NativeMethods.INPUTUNION
                    {
                        ki = new NativeMethods.KEYBDINPUT { wVk = 0, wScan = c, dwFlags = 0x0004 } // KEYEVENTF_UNICODE
                    }
                },
                new()
                {
                    type = NativeMethods.INPUT_KEYBOARD,
                    U = new NativeMethods.INPUTUNION
                    {
                        ki = new NativeMethods.KEYBDINPUT { wVk = 0, wScan = c, dwFlags = 0x0004 | 0x0002 }
                    }
                }
            };

            NativeMethods.SendInput(2, inputs, Marshal.SizeOf<NativeMethods.INPUT>());
            await Task.Delay(20);
        }
    }

    private bool TryUIAutomationClick(RecordedAction action)
    {
        try
        {
            var element = FindUIElement(action);
            if (element == null) return false;

            if (element.TryGetCurrentPattern(InvokePattern.Pattern, out var invokePattern))
            {
                ((InvokePattern)invokePattern).Invoke();
                return true;
            }

            if (element.TryGetCurrentPattern(TogglePattern.Pattern, out var togglePattern))
            {
                ((TogglePattern)togglePattern).Toggle();
                return true;
            }
        }
        catch { }
        return false;
    }

    private void ExecuteUIElementClick(RecordedAction action)
    {
        if (!TryUIAutomationClick(action))
        {
            // Fallback: Koordinaten-Klick
            MoveMouse(action.X, action.Y);
            SendMouseClick(NativeMethods.MOUSEEVENTF_LEFTDOWN, NativeMethods.MOUSEEVENTF_LEFTUP);
        }
    }

    private void ExecuteUIElementSetValue(RecordedAction action)
    {
        var element = FindUIElement(action);
        if (element == null)
            throw new InvalidOperationException($"UI-Element nicht gefunden: {action.ControlName ?? action.AutomationId}");

        if (element.TryGetCurrentPattern(ValuePattern.Pattern, out var pattern))
        {
            ((ValuePattern)pattern).SetValue(action.Value ?? string.Empty);
        }
        else
        {
            throw new InvalidOperationException($"Element unterstützt kein ValuePattern: {action.ControlName}");
        }
    }

    private void ExecuteUIElementSelect(RecordedAction action)
    {
        var element = FindUIElement(action);
        if (element == null)
            throw new InvalidOperationException($"UI-Element nicht gefunden: {action.ControlName ?? action.AutomationId}");

        if (element.TryGetCurrentPattern(SelectionItemPattern.Pattern, out var pattern))
        {
            ((SelectionItemPattern)pattern).Select();
        }
    }

    private void ActivateWindow(RecordedAction action)
    {
        var hWnd = FindWindow(action.WindowTitle, action.ProcessName);
        if (hWnd == IntPtr.Zero)
            throw new InvalidOperationException($"Fenster nicht gefunden: '{action.WindowTitle}'");

        NativeMethods.ShowWindow(hWnd, NativeMethods.SW_RESTORE);
        NativeMethods.SetForegroundWindow(hWnd);
    }

    private void CloseWindow(RecordedAction action)
    {
        var hWnd = FindWindow(action.WindowTitle, action.ProcessName);
        if (hWnd != IntPtr.Zero)
        {
            NativeMethods.PostMessage(hWnd, NativeMethods.WM_CLOSE, IntPtr.Zero, IntPtr.Zero);
        }
    }

    private async Task WaitForElement(RecordedAction action, CancellationToken ct)
    {
        var sw = Stopwatch.StartNew();
        while (sw.ElapsedMilliseconds < action.TimeoutMs)
        {
            ct.ThrowIfCancellationRequested();
            var element = FindUIElement(action);
            if (element != null) return;
            await Task.Delay(500, ct);
        }
        throw new TimeoutException($"Element nicht gefunden innerhalb von {action.TimeoutMs}ms: {action.ControlName ?? action.AutomationId}");
    }

    private async Task WaitForWindow(RecordedAction action, CancellationToken ct)
    {
        var sw = Stopwatch.StartNew();
        while (sw.ElapsedMilliseconds < action.TimeoutMs)
        {
            ct.ThrowIfCancellationRequested();
            var hWnd = FindWindow(action.WindowTitle, action.ProcessName);
            if (hWnd != IntPtr.Zero) return;
            await Task.Delay(500, ct);
        }
        throw new TimeoutException($"Fenster nicht gefunden innerhalb von {action.TimeoutMs}ms: '{action.WindowTitle}'");
    }

    private AutomationElement? FindUIElement(RecordedAction action)
    {
        var root = AutomationElement.RootElement;
        Condition? condition = null;

        if (!string.IsNullOrEmpty(action.AutomationId))
        {
            condition = new PropertyCondition(AutomationElement.AutomationIdProperty, action.AutomationId);
        }
        else if (!string.IsNullOrEmpty(action.ControlName))
        {
            condition = new PropertyCondition(AutomationElement.NameProperty, action.ControlName);
        }

        if (condition == null) return null;

        // Innerhalb des Zielfensters suchen
        if (!string.IsNullOrEmpty(action.WindowTitle))
        {
            var windowCondition = new PropertyCondition(AutomationElement.NameProperty, action.WindowTitle);
            var window = root.FindFirst(TreeScope.Children, windowCondition);
            if (window != null)
                return window.FindFirst(TreeScope.Descendants, condition);
        }

        return root.FindFirst(TreeScope.Descendants, condition);
    }

    private static IntPtr FindWindow(string? title, string? processName)
    {
        IntPtr found = IntPtr.Zero;

        NativeMethods.EnumWindows((hWnd, _) =>
        {
            if (!NativeMethods.IsWindowVisible(hWnd)) return true;

            var windowTitle = NativeMethods.GetWindowTitle(hWnd);
            bool titleMatch = string.IsNullOrEmpty(title) || windowTitle.Contains(title, StringComparison.OrdinalIgnoreCase);
            bool processMatch = true;

            if (!string.IsNullOrEmpty(processName))
            {
                var procName = NativeMethods.GetProcessNameForWindow(hWnd);
                processMatch = procName.Equals(processName, StringComparison.OrdinalIgnoreCase);
            }

            if (titleMatch && processMatch)
            {
                found = hWnd;
                return false;
            }
            return true;
        }, IntPtr.Zero);

        return found;
    }

    private static void MoveMouse(int x, int y)
    {
        NativeMethods.SetCursorPos(x, y);
    }

    private static void SendMouseClick(uint downFlag, uint upFlag)
    {
        var inputs = new NativeMethods.INPUT[]
        {
            new() { type = NativeMethods.INPUT_MOUSE, U = new NativeMethods.INPUTUNION { mi = new NativeMethods.MOUSEINPUT { dwFlags = downFlag } } },
            new() { type = NativeMethods.INPUT_MOUSE, U = new NativeMethods.INPUTUNION { mi = new NativeMethods.MOUSEINPUT { dwFlags = upFlag } } }
        };
        NativeMethods.SendInput(2, inputs, Marshal.SizeOf<NativeMethods.INPUT>());
    }

    private static void SendKey(ushort vkCode, bool keyUp)
    {
        var input = new NativeMethods.INPUT
        {
            type = NativeMethods.INPUT_KEYBOARD,
            U = new NativeMethods.INPUTUNION
            {
                ki = new NativeMethods.KEYBDINPUT
                {
                    wVk = vkCode,
                    dwFlags = keyUp ? NativeMethods.KEYEVENTF_KEYUP : 0
                }
            }
        };
        NativeMethods.SendInput(1, new[] { input }, Marshal.SizeOf<NativeMethods.INPUT>());
    }

    private static RecordedAction SubstituteParameters(RecordedAction action, Dictionary<string, string> parameters)
    {
        var clone = action.Clone();

        foreach (var (key, value) in parameters)
        {
            var placeholder = $"{{{key}}}";
            if (clone.Text?.Contains(placeholder) == true)
                clone.Text = clone.Text.Replace(placeholder, value);
            if (clone.Value?.Contains(placeholder) == true)
                clone.Value = clone.Value.Replace(placeholder, value);
            if (clone.WindowTitle?.Contains(placeholder) == true)
                clone.WindowTitle = clone.WindowTitle.Replace(placeholder, value);
        }

        return clone;
    }
}
