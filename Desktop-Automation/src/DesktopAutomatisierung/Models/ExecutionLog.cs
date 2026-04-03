using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DesktopAutomatisierung.Models;

[JsonConverter(typeof(StringEnumConverter))]
public enum LogLevel
{
    Debug,
    Info,
    Warning,
    Error,
    Critical
}

/// <summary>
/// Einzelner Eintrag im Ausführungsprotokoll
/// </summary>
public class LogEntry
{
    public DateTime Timestamp { get; set; } = DateTime.Now;
    public LogLevel Level { get; set; } = LogLevel.Info;
    public string Message { get; set; } = string.Empty;
    public string? ActionId { get; set; }
    public string? StepId { get; set; }
    public string? ScreenshotBase64 { get; set; }
    public string? ExceptionDetails { get; set; }
}

/// <summary>
/// Protokoll einer einzelnen Workflow- oder Funktionsausführung
/// </summary>
public class ExecutionLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string WorkflowId { get; set; } = string.Empty;
    public string WorkflowName { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; } = DateTime.Now;
    public DateTime? CompletedAt { get; set; }
    public WorkflowStatus FinalStatus { get; set; }
    public string? TriggerId { get; set; }
    public string? TriggerDescription { get; set; }
    public List<LogEntry> Entries { get; set; } = new();
    public Dictionary<string, string> FinalVariables { get; set; } = new();

    public TimeSpan Duration => (CompletedAt ?? DateTime.Now) - StartedAt;

    public void AddEntry(LogLevel level, string message, string? actionId = null, string? stepId = null)
    {
        Entries.Add(new LogEntry
        {
            Level = level,
            Message = message,
            ActionId = actionId,
            StepId = stepId
        });
    }
}
