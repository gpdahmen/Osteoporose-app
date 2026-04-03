using System.IO;
using DesktopAutomatisierung.Helpers;
using DesktopAutomatisierung.Models;

namespace DesktopAutomatisierung.Services;

/// <summary>
/// Führt zusammengesetzte Workflows aus. Verarbeitet Funktionsaufrufe,
/// Bedingungen, Schleifen und Variablen-Substitution.
/// </summary>
public class WorkflowExecutor
{
    private readonly FunctionLibrary _library;
    private readonly PlaybackEngine _playback;
    private readonly DialogWatcher _dialogWatcher;

    private CancellationTokenSource? _cts;
    private bool _isRunning;
    private Dictionary<string, string> _variables = new();
    private ExecutionLog? _currentLog;

    public event EventHandler<WorkflowStep>? StepStarting;
    public event EventHandler<WorkflowStep>? StepCompleted;
    public event EventHandler<(WorkflowStep Step, Exception Error)>? StepFailed;
    public event EventHandler<ExecutionLog>? WorkflowCompleted;
    public event EventHandler<string>? UserPromptRequired;

    public bool IsRunning => _isRunning;
    public ExecutionLog? CurrentLog => _currentLog;

    public WorkflowExecutor(FunctionLibrary library, PlaybackEngine playback, DialogWatcher dialogWatcher)
    {
        _library = library;
        _playback = playback;
        _dialogWatcher = dialogWatcher;
    }

    public async Task ExecuteAsync(Workflow workflow, CancellationToken externalToken = default)
    {
        if (_isRunning) throw new InvalidOperationException("Ein Workflow läuft bereits.");

        _cts = CancellationTokenSource.CreateLinkedTokenSource(externalToken);
        _isRunning = true;
        _variables = new Dictionary<string, string>(workflow.Variables);

        _currentLog = new ExecutionLog
        {
            WorkflowId = workflow.Id,
            WorkflowName = workflow.Name
        };

        _currentLog.AddEntry(LogLevel.Info, $"Workflow '{workflow.Name}' gestartet.");

        // Dialog-Regeln aktivieren
        var dialogRules = workflow.ActiveDialogRuleIds
            .Select(id => LoadDialogRule(id))
            .Where(r => r != null)
            .Cast<DialogRule>()
            .ToList();

        if (dialogRules.Count > 0)
        {
            _dialogWatcher.SetRules(dialogRules);
            _dialogWatcher.Start();
        }

        try
        {
            // Timeout
            if (workflow.MaxExecutionTimeSec > 0)
            {
                _cts.CancelAfter(TimeSpan.FromSeconds(workflow.MaxExecutionTimeSec));
            }

            await ExecuteStepsAsync(workflow.Steps, _cts.Token);

            workflow.Status = WorkflowStatus.Completed;
            _currentLog.FinalStatus = WorkflowStatus.Completed;
            _currentLog.AddEntry(LogLevel.Info, "Workflow erfolgreich abgeschlossen.");
        }
        catch (OperationCanceledException)
        {
            workflow.Status = WorkflowStatus.Cancelled;
            _currentLog.FinalStatus = WorkflowStatus.Cancelled;
            _currentLog.AddEntry(LogLevel.Warning, "Workflow abgebrochen.");
        }
        catch (Exception ex)
        {
            workflow.Status = WorkflowStatus.Failed;
            _currentLog.FinalStatus = WorkflowStatus.Failed;
            _currentLog.AddEntry(LogLevel.Error, $"Workflow fehlgeschlagen: {ex.Message}");
        }
        finally
        {
            _dialogWatcher.Stop();
            _isRunning = false;
            _currentLog.CompletedAt = DateTime.Now;
            _currentLog.FinalVariables = new Dictionary<string, string>(_variables);
            workflow.LastRunAt = DateTime.Now;
            workflow.LastRunResult = _currentLog.FinalStatus.ToString();

            WorkflowCompleted?.Invoke(this, _currentLog);
        }
    }

    public void Stop()
    {
        _cts?.Cancel();
        _playback.Stop();
    }

    private async Task ExecuteStepsAsync(List<WorkflowStep> steps, CancellationToken ct)
    {
        foreach (var step in steps.Where(s => s.Enabled).OrderBy(s => s.SortOrder))
        {
            ct.ThrowIfCancellationRequested();

            StepStarting?.Invoke(this, step);
            _currentLog?.AddEntry(LogLevel.Info, $"Schritt: {step.Label}", stepId: step.Id);

            try
            {
                await ExecuteStepAsync(step, ct);
                StepCompleted?.Invoke(this, step);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _currentLog?.AddEntry(LogLevel.Error, $"Fehler in Schritt '{step.Label}': {ex.Message}", stepId: step.Id);
                StepFailed?.Invoke(this, (step, ex));

                switch (step.OnError)
                {
                    case ErrorBehavior.StopAndNotify:
                        throw;
                    case ErrorBehavior.SkipAction:
                        _currentLog?.AddEntry(LogLevel.Warning, "Schritt übersprungen.", stepId: step.Id);
                        continue;
                    case ErrorBehavior.RetryAction:
                        _currentLog?.AddEntry(LogLevel.Info, "Wiederholung...", stepId: step.Id);
                        await ExecuteStepAsync(step, ct);
                        break;
                    case ErrorBehavior.AbortWorkflow:
                        throw new OperationCanceledException("Workflow abgebrochen wegen Fehler.", ex);
                }
            }
        }
    }

    private async Task ExecuteStepAsync(WorkflowStep step, CancellationToken ct)
    {
        switch (step.Type)
        {
            case WorkflowStepType.FunctionCall:
                await ExecuteFunctionCall(step, ct);
                break;

            case WorkflowStepType.Condition:
                await ExecuteCondition(step, ct);
                break;

            case WorkflowStepType.Loop:
                await ExecuteLoop(step, ct);
                break;

            case WorkflowStepType.Parallel:
                await ExecuteParallel(step, ct);
                break;

            case WorkflowStepType.Wait:
                await Task.Delay(step.WaitMs, ct);
                break;

            case WorkflowStepType.WaitForEvent:
                await WaitForEvent(step, ct);
                break;

            case WorkflowStepType.UserPrompt:
                UserPromptRequired?.Invoke(this, SubstituteVariables(step.Message ?? "Bitte bestätigen"));
                break;

            case WorkflowStepType.LogMessage:
                _currentLog?.AddEntry(LogLevel.Info, SubstituteVariables(step.Message ?? ""));
                break;

            case WorkflowStepType.SetVariable:
                if (step.VariableName != null)
                    _variables[step.VariableName] = SubstituteVariables(step.VariableValue ?? "");
                break;

            case WorkflowStepType.SubWorkflow:
                // Sub-Workflow müsste aus Datei geladen werden
                break;
        }
    }

    private async Task ExecuteFunctionCall(WorkflowStep step, CancellationToken ct)
    {
        if (string.IsNullOrEmpty(step.FunctionId))
            throw new InvalidOperationException("Keine Funktions-ID angegeben.");

        var function = _library.GetById(step.FunctionId)
            ?? throw new InvalidOperationException($"Funktion nicht gefunden: {step.FunctionId}");

        _currentLog?.AddEntry(LogLevel.Info, $"Funktion '{function.Name}' ausführen...");

        // Parameter mit Variablen-Substitution
        var parameters = new Dictionary<string, string>();
        foreach (var (key, value) in step.ParameterValues)
        {
            parameters[key] = SubstituteVariables(value);
        }

        // Funktions-spezifische Dialog-Regeln aktivieren
        if (function.ActiveDialogRuleIds.Count > 0)
        {
            var rules = function.ActiveDialogRuleIds
                .Select(id => LoadDialogRule(id))
                .Where(r => r != null)
                .Cast<DialogRule>();
            foreach (var rule in rules)
                _dialogWatcher.AddRule(rule);
        }

        using var timeout = new CancellationTokenSource();
        if (function.MaxExecutionTimeSec > 0)
            timeout.CancelAfter(TimeSpan.FromSeconds(function.MaxExecutionTimeSec));

        using var linked = CancellationTokenSource.CreateLinkedTokenSource(ct, timeout.Token);

        await _playback.PlayAsync(function.Actions, parameters, linked.Token);
    }

    private async Task ExecuteCondition(WorkflowStep step, CancellationToken ct)
    {
        var condition = SubstituteVariables(step.Condition ?? "false");
        bool result = EvaluateCondition(condition);

        _currentLog?.AddEntry(LogLevel.Debug,
            $"Bedingung '{step.Condition}' = {result} (nach Substitution: '{condition}')");

        if (result)
            await ExecuteStepsAsync(step.ThenSteps, ct);
        else
            await ExecuteStepsAsync(step.ElseSteps, ct);
    }

    private async Task ExecuteLoop(WorkflowStep step, CancellationToken ct)
    {
        int iteration = 0;

        while (iteration < step.MaxIterations)
        {
            ct.ThrowIfCancellationRequested();

            var condition = SubstituteVariables(step.LoopCondition ?? "false");
            if (!EvaluateCondition(condition)) break;

            _variables["_loopIndex"] = iteration.ToString();
            await ExecuteStepsAsync(step.ChildSteps, ct);
            iteration++;
        }

        _currentLog?.AddEntry(LogLevel.Info, $"Schleife nach {iteration} Durchläufen beendet.");
    }

    private async Task ExecuteParallel(WorkflowStep step, CancellationToken ct)
    {
        var tasks = step.ChildSteps
            .Where(s => s.Enabled)
            .Select(s => ExecuteStepAsync(s, ct));

        await Task.WhenAll(tasks);
    }

    private async Task WaitForEvent(WorkflowStep step, CancellationToken ct)
    {
        // Event-basiertes Warten: Prozessstart, Fenster erscheint etc.
        var eventName = SubstituteVariables(step.EventName ?? "");
        _currentLog?.AddEntry(LogLevel.Info, $"Warte auf Event: {eventName}");

        using var timeoutCts = new CancellationTokenSource(step.TimeoutMs);
        using var linked = CancellationTokenSource.CreateLinkedTokenSource(ct, timeoutCts.Token);

        // Polling auf Prozess oder Fenster
        while (!linked.Token.IsCancellationRequested)
        {
            if (eventName.StartsWith("process:", StringComparison.OrdinalIgnoreCase))
            {
                var procName = eventName["process:".Length..];
                var procs = System.Diagnostics.Process.GetProcessesByName(procName);
                if (procs.Length > 0) return;
            }
            else if (eventName.StartsWith("window:", StringComparison.OrdinalIgnoreCase))
            {
                var windowTitle = eventName["window:".Length..];
                var found = FindWindowByTitle(windowTitle);
                if (found) return;
            }

            await Task.Delay(500, linked.Token);
        }

        throw new TimeoutException($"Event '{eventName}' nicht eingetreten innerhalb von {step.TimeoutMs}ms.");
    }

    private string SubstituteVariables(string input)
    {
        var result = input;
        foreach (var (key, value) in _variables)
        {
            result = result.Replace($"{{{key}}}", value);
        }
        return result;
    }

    private static bool EvaluateCondition(string condition)
    {
        condition = condition.Trim();

        if (bool.TryParse(condition, out var boolResult)) return boolResult;

        // Einfache Vergleiche: "wert1 == wert2", "wert1 != wert2"
        if (condition.Contains("=="))
        {
            var parts = condition.Split("==", 2);
            return parts[0].Trim().Equals(parts[1].Trim(), StringComparison.OrdinalIgnoreCase);
        }
        if (condition.Contains("!="))
        {
            var parts = condition.Split("!=", 2);
            return !parts[0].Trim().Equals(parts[1].Trim(), StringComparison.OrdinalIgnoreCase);
        }
        if (condition.Contains("contains:", StringComparison.OrdinalIgnoreCase))
        {
            var parts = condition.Split("contains:", 2, StringSplitOptions.TrimEntries);
            return parts[0].Contains(parts[1], StringComparison.OrdinalIgnoreCase);
        }

        return !string.IsNullOrEmpty(condition) && condition != "0";
    }

    private static bool FindWindowByTitle(string title)
    {
        bool found = false;
        NativeMethods.EnumWindows((hWnd, _) =>
        {
            if (!NativeMethods.IsWindowVisible(hWnd)) return true;
            var windowTitle = NativeMethods.GetWindowTitle(hWnd);
            if (windowTitle.Contains(title, StringComparison.OrdinalIgnoreCase))
            {
                found = true;
                return false;
            }
            return true;
        }, IntPtr.Zero);
        return found;
    }

    private DialogRule? LoadDialogRule(string ruleId)
    {
        // Dialog-Regeln aus dem Speicher laden
        var path = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "DesktopAutomatisierung", "DialogRules", $"{ruleId}.json");

        if (!File.Exists(path)) return null;

        try
        {
            var json = File.ReadAllText(path);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<DialogRule>(json);
        }
        catch { return null; }
    }
}
