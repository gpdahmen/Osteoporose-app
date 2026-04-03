using System.Diagnostics;
using System.IO;
using DesktopAutomatisierung.Helpers;
using DesktopAutomatisierung.Models;

namespace DesktopAutomatisierung.Services;

/// <summary>
/// Zeitlicher und eventbasierter Scheduler für Workflow-Ausführung.
/// Unterstützt Cron-ähnliche Zeitpläne, Prozess-Events, Fenster-Events,
/// Datei-Überwachung und Hotkeys.
/// </summary>
public class SchedulerService : IDisposable
{
    private readonly Dictionary<string, Workflow> _scheduledWorkflows = new();
    private readonly Dictionary<string, FileSystemWatcher> _fileWatchers = new();
    private CancellationTokenSource? _cts;
    private Task? _timerTask;
    private bool _isRunning;

    public event EventHandler<(Workflow Workflow, ScheduleTrigger Trigger)>? WorkflowTriggered;
    public event EventHandler<(string WorkflowId, string Message)>? SchedulerLog;

    public bool IsRunning => _isRunning;

    public void RegisterWorkflow(Workflow workflow)
    {
        _scheduledWorkflows[workflow.Id] = workflow;

        // FileSystemWatcher für FileChange-Trigger einrichten
        foreach (var trigger in workflow.Triggers.Where(t => t.Type == TriggerType.FileChange && t.Enabled))
        {
            SetupFileWatcher(workflow, trigger);
        }

        CalculateNextTrigger(workflow);
    }

    public void UnregisterWorkflow(string workflowId)
    {
        _scheduledWorkflows.Remove(workflowId);

        if (_fileWatchers.TryGetValue(workflowId, out var watcher))
        {
            watcher.Dispose();
            _fileWatchers.Remove(workflowId);
        }
    }

    public void Start()
    {
        if (_isRunning) return;

        _cts = new CancellationTokenSource();
        _isRunning = true;

        _timerTask = Task.Run(() => TimerLoop(_cts.Token), _cts.Token);

        Log("Scheduler", "Scheduler gestartet.");
    }

    public void Stop()
    {
        if (!_isRunning) return;

        _cts?.Cancel();
        try { _timerTask?.Wait(3000); } catch { }

        foreach (var watcher in _fileWatchers.Values)
            watcher.Dispose();
        _fileWatchers.Clear();

        _isRunning = false;
        Log("Scheduler", "Scheduler gestoppt.");
    }

    private async Task TimerLoop(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            var now = DateTime.Now;

            foreach (var workflow in _scheduledWorkflows.Values.Where(w => w.Enabled))
            {
                foreach (var trigger in workflow.Triggers.Where(t => t.Enabled))
                {
                    if (ShouldTrigger(trigger, now))
                    {
                        TriggerWorkflow(workflow, trigger);
                    }

                    // Prozess-Events prüfen
                    if (trigger.Type is TriggerType.ProcessStart or TriggerType.ProcessExit &&
                        !string.IsNullOrEmpty(trigger.ProcessName))
                    {
                        CheckProcessTrigger(workflow, trigger);
                    }

                    // Fenster-Events prüfen
                    if (trigger.Type is TriggerType.WindowAppears or TriggerType.WindowDisappears &&
                        !string.IsNullOrEmpty(trigger.WindowTitlePattern))
                    {
                        CheckWindowTrigger(workflow, trigger);
                    }
                }
            }

            try { await Task.Delay(1000, ct); }
            catch (OperationCanceledException) { break; }
        }
    }

    private bool ShouldTrigger(ScheduleTrigger trigger, DateTime now)
    {
        // Abgelaufen?
        if (trigger.ExpiresAt.HasValue && now > trigger.ExpiresAt.Value) return false;

        // Max. Ausführungen erreicht?
        if (trigger.MaxExecutions > 0 && trigger.ExecutionCount >= trigger.MaxExecutions) return false;

        switch (trigger.Type)
        {
            case TriggerType.OneTime:
                if (trigger.StartTime.HasValue && trigger.ExecutionCount == 0)
                    return now >= trigger.StartTime.Value;
                return false;

            case TriggerType.Interval:
                if (trigger.LastTriggeredAt == null) return true;
                return (now - trigger.LastTriggeredAt.Value).TotalMinutes >= trigger.IntervalMinutes;

            case TriggerType.Daily:
                if (!trigger.TimeOfDay.HasValue) return false;
                if (trigger.LastTriggeredAt?.Date == now.Date) return false;
                return now.TimeOfDay >= trigger.TimeOfDay.Value;

            case TriggerType.Weekly:
                if (!trigger.TimeOfDay.HasValue) return false;
                if (!trigger.DaysOfWeek.Contains(now.DayOfWeek)) return false;
                if (trigger.LastTriggeredAt?.Date == now.Date) return false;
                return now.TimeOfDay >= trigger.TimeOfDay.Value;

            case TriggerType.Monthly:
                if (!trigger.TimeOfDay.HasValue) return false;
                if (now.Day != trigger.DayOfMonth) return false;
                if (trigger.LastTriggeredAt?.Date == now.Date) return false;
                return now.TimeOfDay >= trigger.TimeOfDay.Value;

            default:
                return false; // Event-basierte Trigger werden separat geprüft
        }
    }

    // Tracking für Prozess-/Fenster-State
    private readonly Dictionary<string, bool> _processStates = new();
    private readonly Dictionary<string, bool> _windowStates = new();

    private void CheckProcessTrigger(Workflow workflow, ScheduleTrigger trigger)
    {
        var key = $"{workflow.Id}_{trigger.Id}_proc";
        var processes = Process.GetProcessesByName(trigger.ProcessName!);
        bool isRunning = processes.Length > 0;

        _processStates.TryGetValue(key, out bool wasRunning);

        if (trigger.Type == TriggerType.ProcessStart && isRunning && !wasRunning)
        {
            TriggerWorkflow(workflow, trigger);
        }
        else if (trigger.Type == TriggerType.ProcessExit && !isRunning && wasRunning)
        {
            TriggerWorkflow(workflow, trigger);
        }

        _processStates[key] = isRunning;
    }

    private void CheckWindowTrigger(Workflow workflow, ScheduleTrigger trigger)
    {
        var key = $"{workflow.Id}_{trigger.Id}_win";
        bool windowExists = FindWindow(trigger.WindowTitlePattern!);

        _windowStates.TryGetValue(key, out bool existed);

        if (trigger.Type == TriggerType.WindowAppears && windowExists && !existed)
        {
            TriggerWorkflow(workflow, trigger);
        }
        else if (trigger.Type == TriggerType.WindowDisappears && !windowExists && existed)
        {
            TriggerWorkflow(workflow, trigger);
        }

        _windowStates[key] = windowExists;
    }

    private void SetupFileWatcher(Workflow workflow, ScheduleTrigger trigger)
    {
        if (string.IsNullOrEmpty(trigger.WatchPath)) return;

        try
        {
            var watcher = new FileSystemWatcher
            {
                Path = trigger.WatchPath,
                Filter = trigger.FileFilter ?? "*.*",
                NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.CreationTime,
                EnableRaisingEvents = true
            };

            watcher.Changed += (_, _) => TriggerWorkflow(workflow, trigger);
            watcher.Created += (_, _) => TriggerWorkflow(workflow, trigger);

            _fileWatchers[$"{workflow.Id}_{trigger.Id}"] = watcher;
        }
        catch (Exception ex)
        {
            Log(workflow.Id, $"FileWatcher-Fehler: {ex.Message}");
        }
    }

    private void TriggerWorkflow(Workflow workflow, ScheduleTrigger trigger)
    {
        if (trigger.PreventConcurrentRun && workflow.Status == WorkflowStatus.Running)
            return;

        trigger.LastTriggeredAt = DateTime.Now;
        trigger.ExecutionCount++;

        Log(workflow.Id, $"Trigger '{trigger.Name}' ({trigger.Type}) ausgelöst.");
        WorkflowTriggered?.Invoke(this, (workflow, trigger));
    }

    private void CalculateNextTrigger(Workflow workflow)
    {
        foreach (var trigger in workflow.Triggers.Where(t => t.Enabled))
        {
            trigger.NextTriggerAt = CalculateNext(trigger);
        }
    }

    private static DateTime? CalculateNext(ScheduleTrigger trigger)
    {
        var now = DateTime.Now;

        return trigger.Type switch
        {
            TriggerType.OneTime => trigger.StartTime > now ? trigger.StartTime : null,

            TriggerType.Interval => (trigger.LastTriggeredAt ?? now)
                .AddMinutes(trigger.IntervalMinutes),

            TriggerType.Daily when trigger.TimeOfDay.HasValue =>
                now.TimeOfDay < trigger.TimeOfDay.Value
                    ? now.Date + trigger.TimeOfDay.Value
                    : now.Date.AddDays(1) + trigger.TimeOfDay.Value,

            _ => null
        };
    }

    private static bool FindWindow(string titlePattern)
    {
        bool found = false;
        NativeMethods.EnumWindows((hWnd, _) =>
        {
            if (!NativeMethods.IsWindowVisible(hWnd)) return true;
            var title = NativeMethods.GetWindowTitle(hWnd);
            if (title.Contains(titlePattern, StringComparison.OrdinalIgnoreCase))
            {
                found = true;
                return false;
            }
            return true;
        }, IntPtr.Zero);
        return found;
    }

    private void Log(string workflowId, string message)
    {
        SchedulerLog?.Invoke(this, (workflowId, message));
    }

    public void Dispose()
    {
        Stop();
        GC.SuppressFinalize(this);
    }
}
