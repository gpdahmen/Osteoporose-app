using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DesktopAutomatisierung.Models;

/// <summary>
/// Typ eines Workflow-Schritts
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum WorkflowStepType
{
    FunctionCall,
    Condition,
    Loop,
    Parallel,
    Wait,
    WaitForEvent,
    SubWorkflow,
    UserPrompt,
    LogMessage,
    SetVariable,
    RunScript
}

/// <summary>
/// Ausführungsstatus eines Workflows
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum WorkflowStatus
{
    Idle,
    Running,
    Paused,
    Completed,
    Failed,
    Cancelled
}

/// <summary>
/// Einzelner Schritt innerhalb eines Workflows.
/// Kann eine Funktion aufrufen, eine Bedingung prüfen oder eine Schleife darstellen.
/// </summary>
public class WorkflowStep
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public WorkflowStepType Type { get; set; }
    public string Label { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public int SortOrder { get; set; }

    /// <summary>ID der aufzurufenden Funktion (bei FunctionCall)</summary>
    public string? FunctionId { get; set; }

    /// <summary>Parameter-Werte für den Funktionsaufruf (Key=Parametername)</summary>
    public Dictionary<string, string> ParameterValues { get; set; } = new();

    /// <summary>Bedingungsausdruck (bei Condition) – z.B. "{Variable} == 'Wert'"</summary>
    public string? Condition { get; set; }

    /// <summary>Schritte bei erfüllter Bedingung</summary>
    public List<WorkflowStep> ThenSteps { get; set; } = new();

    /// <summary>Schritte bei nicht erfüllter Bedingung</summary>
    public List<WorkflowStep> ElseSteps { get; set; } = new();

    /// <summary>Schleifenbedingung (bei Loop)</summary>
    public string? LoopCondition { get; set; }

    /// <summary>Max. Schleifendurchläufe (Sicherheitslimit)</summary>
    public int MaxIterations { get; set; } = 100;

    /// <summary>Kind-Schritte (bei Loop, Parallel)</summary>
    public List<WorkflowStep> ChildSteps { get; set; } = new();

    /// <summary>Event-Name, auf den gewartet wird (bei WaitForEvent)</summary>
    public string? EventName { get; set; }

    /// <summary>Timeout in Millisekunden</summary>
    public int TimeoutMs { get; set; } = 30000;

    /// <summary>Wartezeit in Millisekunden (bei Wait)</summary>
    public int WaitMs { get; set; }

    /// <summary>Variablenname (bei SetVariable)</summary>
    public string? VariableName { get; set; }

    /// <summary>Variablenwert oder Ausdruck</summary>
    public string? VariableValue { get; set; }

    /// <summary>Nachricht für UserPrompt oder LogMessage</summary>
    public string? Message { get; set; }

    /// <summary>Skript-Code (bei RunScript, C#-Ausdruck)</summary>
    public string? ScriptCode { get; set; }

    public ErrorBehavior OnError { get; set; } = ErrorBehavior.StopAndNotify;
}

/// <summary>
/// Ein vollständiger Workflow, der aus mehreren Schritten (Funktionsaufrufen,
/// Bedingungen, Schleifen) besteht und zeitlich oder eventbasiert ausgelöst werden kann.
/// </summary>
public class Workflow
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public FunctionCategory Category { get; set; } = FunctionCategory.Allgemein;
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime ModifiedAt { get; set; } = DateTime.Now;
    public bool Enabled { get; set; } = true;

    /// <summary>Die Schritte dieses Workflows</summary>
    public List<WorkflowStep> Steps { get; set; } = new();

    /// <summary>Globale Variablen des Workflows</summary>
    public Dictionary<string, string> Variables { get; set; } = new();

    /// <summary>Trigger für automatische Ausführung</summary>
    public List<ScheduleTrigger> Triggers { get; set; } = new();

    /// <summary>Dialog-Regeln, die während der gesamten Workflow-Ausführung aktiv sind</summary>
    public List<string> ActiveDialogRuleIds { get; set; } = new();

    /// <summary>Max. Gesamtausführungszeit in Sekunden (0 = unbegrenzt)</summary>
    public int MaxExecutionTimeSec { get; set; }

    /// <summary>Aktueller Status</summary>
    [JsonIgnore]
    public WorkflowStatus Status { get; set; } = WorkflowStatus.Idle;

    /// <summary>Letzte Ausführung</summary>
    public DateTime? LastRunAt { get; set; }

    /// <summary>Letztes Ergebnis</summary>
    public string? LastRunResult { get; set; }
}
