using System.Text.RegularExpressions;
using System.Windows.Automation;
using DesktopAutomatisierung.Helpers;
using DesktopAutomatisierung.Models;

namespace DesktopAutomatisierung.Services;

/// <summary>
/// Überwacht den Desktop auf unerwartete Dialog-Fenster und reagiert
/// automatisch gemäß konfigurierter Regeln. Läuft als Hintergrund-Task.
/// </summary>
public class DialogWatcher : IDisposable
{
    private readonly List<DialogRule> _rules = new();
    private CancellationTokenSource? _cts;
    private Task? _watchTask;
    private bool _isRunning;
    private readonly object _lock = new();

    /// <summary>Abfrage-Intervall in Millisekunden</summary>
    public int PollIntervalMs { get; set; } = 500;

    /// <summary>Wird ausgelöst, wenn ein Dialog erkannt und behandelt wurde</summary>
    public event EventHandler<(DialogRule Rule, string WindowTitle)>? DialogHandled;

    /// <summary>Wird ausgelöst, wenn ein Dialog erkannt aber nicht behandelt werden konnte</summary>
    public event EventHandler<(DialogRule Rule, string WindowTitle, Exception Error)>? DialogHandleFailed;

    /// <summary>Wird ausgelöst, wenn eine Funktion als Reaktion ausgeführt werden soll</summary>
    public event EventHandler<string>? FunctionExecutionRequested;

    /// <summary>Wird ausgelöst, wenn der Workflow pausiert werden soll</summary>
    public event EventHandler? PauseRequested;

    public bool IsRunning => _isRunning;

    // Cooldown-Tracking pro Regel
    private readonly Dictionary<string, DateTime> _lastTriggerTimes = new();
    private readonly Dictionary<string, int> _triggerCounts = new();

    public void SetRules(IEnumerable<DialogRule> rules)
    {
        lock (_lock)
        {
            _rules.Clear();
            _rules.AddRange(rules.Where(r => r.Enabled).OrderBy(r => r.Priority));
        }
    }

    public void AddRule(DialogRule rule)
    {
        lock (_lock)
        {
            _rules.Add(rule);
            _rules.Sort((a, b) => a.Priority.CompareTo(b.Priority));
        }
    }

    public void RemoveRule(string ruleId)
    {
        lock (_lock)
        {
            _rules.RemoveAll(r => r.Id == ruleId);
        }
    }

    public void Start()
    {
        if (_isRunning) return;

        _cts = new CancellationTokenSource();
        _isRunning = true;
        _triggerCounts.Clear();
        _lastTriggerTimes.Clear();

        _watchTask = Task.Run(() => WatchLoop(_cts.Token), _cts.Token);
    }

    public void Stop()
    {
        if (!_isRunning) return;

        _cts?.Cancel();
        try { _watchTask?.Wait(2000); } catch { }
        _isRunning = false;
    }

    public void ResetCounters()
    {
        _triggerCounts.Clear();
        _lastTriggerTimes.Clear();
    }

    private async Task WatchLoop(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                ScanForDialogs();
            }
            catch (Exception)
            {
                // Scan-Fehler ignorieren, nächsten Durchlauf abwarten
            }

            try { await Task.Delay(PollIntervalMs, ct); }
            catch (OperationCanceledException) { break; }
        }
    }

    private void ScanForDialogs()
    {
        var windows = GetVisibleWindows();

        List<DialogRule> currentRules;
        lock (_lock)
        {
            currentRules = new List<DialogRule>(_rules);
        }

        foreach (var (hWnd, title, className, processName) in windows)
        {
            foreach (var rule in currentRules)
            {
                if (!rule.Enabled) continue;
                if (!MatchesRule(rule, title, className, processName)) continue;
                if (!CheckCooldown(rule)) continue;
                if (!CheckMaxTriggers(rule)) continue;

                // Zusätzliche Inhaltsprüfung
                if (rule.RequiredContentPatterns.Count > 0)
                {
                    if (!CheckContentPatterns(hWnd, rule.RequiredContentPatterns))
                        continue;
                }

                // Dialog erkannt – reagieren
                try
                {
                    if (rule.DelayBeforeActionMs > 0)
                        Thread.Sleep(rule.DelayBeforeActionMs);

                    HandleDialog(hWnd, rule);
                    RecordTrigger(rule);
                    DialogHandled?.Invoke(this, (rule, title));
                }
                catch (Exception ex)
                {
                    DialogHandleFailed?.Invoke(this, (rule, title, ex));
                }

                break; // Nur erste passende Regel anwenden
            }
        }
    }

    private bool MatchesRule(DialogRule rule, string title, string className, string processName)
    {
        // Prozess-Filter
        if (!string.IsNullOrEmpty(rule.ProcessNameFilter) &&
            !processName.Equals(rule.ProcessNameFilter, StringComparison.OrdinalIgnoreCase))
            return false;

        // Klassen-Filter
        if (!string.IsNullOrEmpty(rule.ClassNameFilter) &&
            !className.Equals(rule.ClassNameFilter, StringComparison.OrdinalIgnoreCase))
            return false;

        // Titel-Matching
        return rule.MatchMethod switch
        {
            DialogMatchMethod.ExactTitle => title.Equals(rule.MatchPattern, StringComparison.OrdinalIgnoreCase),
            DialogMatchMethod.ContainsTitle => title.Contains(rule.MatchPattern, StringComparison.OrdinalIgnoreCase),
            DialogMatchMethod.RegexTitle => Regex.IsMatch(title, rule.MatchPattern, RegexOptions.IgnoreCase),
            DialogMatchMethod.ClassName => className.Equals(rule.MatchPattern, StringComparison.OrdinalIgnoreCase),
            DialogMatchMethod.ProcessName => processName.Equals(rule.MatchPattern, StringComparison.OrdinalIgnoreCase),
            _ => false
        };
    }

    private bool CheckCooldown(DialogRule rule)
    {
        if (rule.CooldownMs <= 0) return true;
        if (!_lastTriggerTimes.TryGetValue(rule.Id, out var lastTime)) return true;
        return (DateTime.Now - lastTime).TotalMilliseconds >= rule.CooldownMs;
    }

    private bool CheckMaxTriggers(DialogRule rule)
    {
        if (rule.MaxTriggersPerRun <= 0) return true;
        _triggerCounts.TryGetValue(rule.Id, out int count);
        return count < rule.MaxTriggersPerRun;
    }

    private void RecordTrigger(DialogRule rule)
    {
        _lastTriggerTimes[rule.Id] = DateTime.Now;
        _triggerCounts.TryGetValue(rule.Id, out int count);
        _triggerCounts[rule.Id] = count + 1;
    }

    private void HandleDialog(IntPtr hWnd, DialogRule rule)
    {
        switch (rule.Action)
        {
            case DialogAction.ClickButton:
                ClickDialogButton(hWnd, rule);
                break;

            case DialogAction.SendKeys:
                NativeMethods.SetForegroundWindow(hWnd);
                Thread.Sleep(100);
                System.Windows.Forms.SendKeys.SendWait(rule.SendKeysSequence ?? "{ENTER}");
                break;

            case DialogAction.Close:
                NativeMethods.PostMessage(hWnd, NativeMethods.WM_CLOSE, IntPtr.Zero, IntPtr.Zero);
                break;

            case DialogAction.Dismiss:
                // ESC senden
                NativeMethods.SetForegroundWindow(hWnd);
                Thread.Sleep(100);
                System.Windows.Forms.SendKeys.SendWait("{ESC}");
                break;

            case DialogAction.PauseWorkflow:
                PauseRequested?.Invoke(this, EventArgs.Empty);
                break;

            case DialogAction.RunFunction:
                if (!string.IsNullOrEmpty(rule.FunctionId))
                    FunctionExecutionRequested?.Invoke(this, rule.FunctionId);
                break;

            case DialogAction.Ignore:
                break;
        }
    }

    private void ClickDialogButton(IntPtr hWnd, DialogRule rule)
    {
        try
        {
            var windowElement = AutomationElement.FromHandle(hWnd);
            AutomationElement? button = null;

            if (!string.IsNullOrEmpty(rule.ButtonAutomationId))
            {
                var condition = new PropertyCondition(AutomationElement.AutomationIdProperty, rule.ButtonAutomationId);
                button = windowElement.FindFirst(TreeScope.Descendants, condition);
            }

            if (button == null && !string.IsNullOrEmpty(rule.ButtonText))
            {
                var condition = new AndCondition(
                    new PropertyCondition(AutomationElement.NameProperty, rule.ButtonText),
                    new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button));
                button = windowElement.FindFirst(TreeScope.Descendants, condition);
            }

            if (button != null && button.TryGetCurrentPattern(InvokePattern.Pattern, out var pattern))
            {
                ((InvokePattern)pattern).Invoke();
            }
            else
            {
                // Fallback: Dialog schließen mit Enter
                NativeMethods.SetForegroundWindow(hWnd);
                Thread.Sleep(100);
                System.Windows.Forms.SendKeys.SendWait("{ENTER}");
            }
        }
        catch
        {
            // Letzter Fallback
            NativeMethods.PostMessage(hWnd, NativeMethods.WM_CLOSE, IntPtr.Zero, IntPtr.Zero);
        }
    }

    private bool CheckContentPatterns(IntPtr hWnd, List<string> patterns)
    {
        try
        {
            var element = AutomationElement.FromHandle(hWnd);
            var textElements = element.FindAll(TreeScope.Descendants,
                new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text));

            var allText = string.Join(" ", textElements.Cast<AutomationElement>()
                .Select(e => e.Current.Name));

            return patterns.All(p => allText.Contains(p, StringComparison.OrdinalIgnoreCase));
        }
        catch
        {
            return false;
        }
    }

    private static List<(IntPtr HWnd, string Title, string ClassName, string ProcessName)> GetVisibleWindows()
    {
        var result = new List<(IntPtr, string, string, string)>();

        NativeMethods.EnumWindows((hWnd, _) =>
        {
            if (!NativeMethods.IsWindowVisible(hWnd)) return true;

            var title = NativeMethods.GetWindowTitle(hWnd);
            if (string.IsNullOrWhiteSpace(title)) return true;

            var className = NativeMethods.GetWindowClassName(hWnd);
            var processName = NativeMethods.GetProcessNameForWindow(hWnd);

            // Typische Dialog-Fensterklassen prüfen
            if (className is "#32770" or "Dialog" or "MessageBoxEx" ||
                title.Contains("Fehler", StringComparison.OrdinalIgnoreCase) ||
                title.Contains("Error", StringComparison.OrdinalIgnoreCase) ||
                title.Contains("Warnung", StringComparison.OrdinalIgnoreCase) ||
                title.Contains("Warning", StringComparison.OrdinalIgnoreCase) ||
                title.Contains("Bestätigung", StringComparison.OrdinalIgnoreCase) ||
                title.Contains("Confirm", StringComparison.OrdinalIgnoreCase))
            {
                result.Add((hWnd, title, className, processName));
            }

            return true;
        }, IntPtr.Zero);

        return result;
    }

    public void Dispose()
    {
        Stop();
        GC.SuppressFinalize(this);
    }
}
