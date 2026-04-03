using System.Collections.ObjectModel;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using DesktopAutomatisierung.Models;
using DesktopAutomatisierung.Services;

namespace DesktopAutomatisierung.ViewModels;

public partial class MainViewModel : ObservableObject
{
    public static FunctionCategory[] Categories { get; } = Enum.GetValues<FunctionCategory>();

    private readonly RecordingEngine _recorder;
    private readonly PlaybackEngine _playback;
    private readonly DialogWatcher _dialogWatcher;
    private readonly FunctionLibrary _library;
    private readonly WorkflowExecutor _workflowExecutor;
    private readonly SchedulerService _scheduler;

    // --- Aufnahme ---
    [ObservableProperty] private bool _isRecording;
    [ObservableProperty] private bool _isRecordingPaused;
    [ObservableProperty] private string _recordingStatus = "Bereit";
    [ObservableProperty] private int _recordedActionCount;

    // --- Wiedergabe ---
    [ObservableProperty] private bool _isPlaying;
    [ObservableProperty] private bool _isPlayingPaused;
    [ObservableProperty] private float _playbackSpeed = 1.0f;
    [ObservableProperty] private int _playbackProgress;
    [ObservableProperty] private string _playbackStatus = "";

    // --- Navigation ---
    [ObservableProperty] private int _selectedTabIndex;
    [ObservableProperty] private string _statusBarText = "Desktop-Automatisierung bereit.";

    // --- Aufgezeichnete Aktionen ---
    public ObservableCollection<RecordedAction> RecordedActions { get; } = new();

    [ObservableProperty] private RecordedAction? _selectedAction;

    // --- Bibliothek ---
    public ObservableCollection<AutomationFunction> Functions { get; } = new();

    [ObservableProperty] private AutomationFunction? _selectedFunction;
    [ObservableProperty] private string _functionSearchText = "";
    [ObservableProperty] private FunctionCategory? _selectedCategory;

    // --- Workflows ---
    public ObservableCollection<Workflow> Workflows { get; } = new();

    [ObservableProperty] private Workflow? _selectedWorkflow;

    // --- Dialog-Regeln ---
    public ObservableCollection<DialogRule> DialogRules { get; } = new();

    [ObservableProperty] private DialogRule? _selectedDialogRule;

    // --- Log ---
    public ObservableCollection<string> LogMessages { get; } = new();

    public MainViewModel()
    {
        _recorder = new RecordingEngine();
        _playback = new PlaybackEngine();
        _dialogWatcher = new DialogWatcher();
        _library = new FunctionLibrary();
        _workflowExecutor = new WorkflowExecutor(_library, _playback, _dialogWatcher);
        _scheduler = new SchedulerService();

        // Events verdrahten
        _recorder.ActionRecorded += OnActionRecorded;
        _recorder.RecordingStarted += (_, _) => { IsRecording = true; RecordingStatus = "Aufnahme läuft..."; };
        _recorder.RecordingStopped += (_, _) => { IsRecording = false; RecordingStatus = $"Aufnahme beendet – {RecordedActions.Count} Aktionen"; };
        _recorder.RecordingPaused += (_, _) => { IsRecordingPaused = true; RecordingStatus = "Aufnahme pausiert"; };
        _recorder.RecordingResumed += (_, _) => { IsRecordingPaused = false; RecordingStatus = "Aufnahme läuft..."; };

        _playback.ActionStarting += (_, a) => PlaybackStatus = a.ToString();
        _playback.PlaybackFinished += (_, success) =>
        {
            IsPlaying = false;
            PlaybackStatus = success ? "Wiedergabe abgeschlossen" : "Wiedergabe fehlgeschlagen";
        };

        _dialogWatcher.DialogHandled += (_, args) => AddLog($"Dialog abgefangen: '{args.WindowTitle}' → Regel '{args.Rule.Name}'");

        _scheduler.WorkflowTriggered += async (_, args) =>
        {
            AddLog($"Scheduler: Workflow '{args.Workflow.Name}' ausgelöst durch '{args.Trigger.Name}'");
            await _workflowExecutor.ExecuteAsync(args.Workflow);
        };
        _scheduler.SchedulerLog += (_, args) => AddLog($"[Scheduler] {args.Message}");

        _workflowExecutor.StepStarting += (_, step) => AddLog($"  → Schritt: {step.Label}");
        _workflowExecutor.StepFailed += (_, args) => AddLog($"  ✗ Fehler: {args.Error.Message}");
        _workflowExecutor.WorkflowCompleted += (_, log) => AddLog($"Workflow beendet: {log.FinalStatus} ({log.Duration:mm\\:ss})");

        // Bibliothek laden
        _library.LoadAll();
        foreach (var func in _library.GetAll())
            Functions.Add(func);
    }

    // === Aufnahme-Commands ===

    [RelayCommand]
    private void StartRecording()
    {
        RecordedActions.Clear();
        RecordedActionCount = 0;
        _recorder.CaptureScreenshots = false;
        _recorder.RecordUIElements = true;
        _recorder.StartRecording();
        AddLog("Aufnahme gestartet.");
    }

    [RelayCommand]
    private void StopRecording()
    {
        _recorder.StopRecording();
        AddLog($"Aufnahme gestoppt. {RecordedActions.Count} Aktionen aufgezeichnet.");
    }

    [RelayCommand]
    private void PauseResumeRecording()
    {
        if (_recorder.IsPaused)
            _recorder.ResumeRecording();
        else
            _recorder.PauseRecording();
    }

    // === Wiedergabe-Commands ===

    [RelayCommand]
    private async Task PlayRecordedActions()
    {
        if (RecordedActions.Count == 0) return;

        IsPlaying = true;
        _playback.SpeedMultiplier = PlaybackSpeed;
        AddLog($"Wiedergabe gestartet ({RecordedActions.Count} Aktionen, {PlaybackSpeed}x)...");
        await _playback.PlayAsync(RecordedActions.ToList());
    }

    [RelayCommand]
    private async Task PlayFunction()
    {
        if (SelectedFunction == null) return;

        IsPlaying = true;
        _playback.SpeedMultiplier = PlaybackSpeed;
        AddLog($"Funktion '{SelectedFunction.Name}' wird ausgeführt...");
        await _playback.PlayAsync(SelectedFunction.Actions);
    }

    [RelayCommand]
    private void PauseResumePlayback()
    {
        if (_playback.IsPaused)
            _playback.Resume();
        else
            _playback.Pause();

        IsPlayingPaused = _playback.IsPaused;
    }

    [RelayCommand]
    private void StopPlayback()
    {
        _playback.Stop();
        AddLog("Wiedergabe abgebrochen.");
    }

    // === Bibliothek-Commands ===

    [RelayCommand]
    private void SaveAsFunction()
    {
        if (RecordedActions.Count == 0) return;

        var function = _library.CreateFromRecording(
            $"Neue Funktion {DateTime.Now:dd.MM.yyyy HH:mm}",
            RecordedActions.ToList());

        Functions.Add(function);
        SelectedFunction = function;
        SelectedTabIndex = 1; // Zur Bibliothek wechseln
        AddLog($"Funktion '{function.Name}' in Bibliothek gespeichert.");
    }

    [RelayCommand]
    private void SaveFunction()
    {
        if (SelectedFunction == null) return;
        _library.Save(SelectedFunction);
        AddLog($"Funktion '{SelectedFunction.Name}' gespeichert.");
    }

    [RelayCommand]
    private void DeleteFunction()
    {
        if (SelectedFunction == null) return;
        var name = SelectedFunction.Name;
        _library.Delete(SelectedFunction.Id);
        Functions.Remove(SelectedFunction);
        SelectedFunction = null;
        AddLog($"Funktion '{name}' gelöscht.");
    }

    [RelayCommand]
    private void DuplicateFunction()
    {
        if (SelectedFunction == null) return;
        var clone = _library.Duplicate(SelectedFunction.Id);
        Functions.Add(clone);
        SelectedFunction = clone;
        AddLog($"Funktion dupliziert: '{clone.Name}'.");
    }

    [RelayCommand]
    private void SearchFunctions()
    {
        Functions.Clear();
        var results = string.IsNullOrWhiteSpace(FunctionSearchText)
            ? _library.GetAll()
            : _library.Search(FunctionSearchText);

        if (SelectedCategory.HasValue)
            results = results.Where(f => f.Category == SelectedCategory.Value);

        foreach (var func in results)
            Functions.Add(func);
    }

    // === Workflow-Commands ===

    [RelayCommand]
    private void CreateWorkflow()
    {
        var workflow = new Workflow { Name = $"Neuer Workflow {DateTime.Now:dd.MM.yyyy HH:mm}" };
        Workflows.Add(workflow);
        SelectedWorkflow = workflow;
        AddLog($"Workflow '{workflow.Name}' erstellt.");
    }

    [RelayCommand]
    private void AddStepToWorkflow()
    {
        if (SelectedWorkflow == null || SelectedFunction == null) return;

        var step = new WorkflowStep
        {
            Type = WorkflowStepType.FunctionCall,
            Label = SelectedFunction.Name,
            FunctionId = SelectedFunction.Id,
            SortOrder = SelectedWorkflow.Steps.Count
        };

        SelectedWorkflow.Steps.Add(step);
        AddLog($"Schritt '{step.Label}' zum Workflow hinzugefügt.");
    }

    [RelayCommand]
    private async Task RunWorkflow()
    {
        if (SelectedWorkflow == null) return;

        AddLog($"Workflow '{SelectedWorkflow.Name}' wird ausgeführt...");
        await _workflowExecutor.ExecuteAsync(SelectedWorkflow);
    }

    [RelayCommand]
    private void StopWorkflow()
    {
        _workflowExecutor.Stop();
        AddLog("Workflow-Ausführung abgebrochen.");
    }

    // === Scheduler-Commands ===

    [RelayCommand]
    private void StartScheduler()
    {
        foreach (var workflow in Workflows.Where(w => w.Triggers.Count > 0))
            _scheduler.RegisterWorkflow(workflow);

        _scheduler.Start();
        AddLog("Scheduler gestartet.");
        StatusBarText = "Scheduler aktiv – Workflows werden überwacht.";
    }

    [RelayCommand]
    private void StopScheduler()
    {
        _scheduler.Stop();
        AddLog("Scheduler gestoppt.");
        StatusBarText = "Scheduler gestoppt.";
    }

    // === Dialog-Regel-Commands ===

    [RelayCommand]
    private void AddDialogRule()
    {
        var rule = new DialogRule
        {
            Name = "Neue Regel",
            MatchMethod = DialogMatchMethod.ContainsTitle,
            Action = DialogAction.ClickButton
        };
        DialogRules.Add(rule);
        SelectedDialogRule = rule;
    }

    [RelayCommand]
    private void DeleteDialogRule()
    {
        if (SelectedDialogRule == null) return;
        DialogRules.Remove(SelectedDialogRule);
        SelectedDialogRule = null;
    }

    // === Aktions-Editor ===

    [RelayCommand]
    private void DeleteAction()
    {
        if (SelectedAction == null) return;
        RecordedActions.Remove(SelectedAction);
        SelectedAction = null;
    }

    [RelayCommand]
    private void MoveActionUp()
    {
        if (SelectedAction == null) return;
        int idx = RecordedActions.IndexOf(SelectedAction);
        if (idx > 0) RecordedActions.Move(idx, idx - 1);
    }

    [RelayCommand]
    private void MoveActionDown()
    {
        if (SelectedAction == null) return;
        int idx = RecordedActions.IndexOf(SelectedAction);
        if (idx < RecordedActions.Count - 1) RecordedActions.Move(idx, idx + 1);
    }

    // === Hilfsmethoden ===

    private void OnActionRecorded(object? sender, RecordedAction action)
    {
        System.Windows.Application.Current?.Dispatcher.Invoke(() =>
        {
            RecordedActions.Add(action);
            RecordedActionCount = RecordedActions.Count;
        });
    }

    private void AddLog(string message)
    {
        var entry = $"[{DateTime.Now:HH:mm:ss}] {message}";
        System.Windows.Application.Current?.Dispatcher.Invoke(() =>
        {
            LogMessages.Insert(0, entry);
            if (LogMessages.Count > 500)
                LogMessages.RemoveAt(LogMessages.Count - 1);
        });
    }

    public void Cleanup()
    {
        _recorder.Dispose();
        _dialogWatcher.Dispose();
        _scheduler.Dispose();
    }
}
