using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DesktopAutomatisierung.Models;

/// <summary>
/// Wie soll auf den erkannten Dialog reagiert werden?
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum DialogAction
{
    ClickButton,
    SendKeys,
    Close,
    Ignore,
    PauseWorkflow,
    RunFunction,
    Dismiss
}

/// <summary>
/// Erkennungsmethode für den Dialog
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum DialogMatchMethod
{
    ExactTitle,
    ContainsTitle,
    RegexTitle,
    ClassName,
    AutomationId,
    ProcessName,
    WindowStyle
}

/// <summary>
/// Regel zum automatischen Abfangen und Behandeln von unerwarteten Dialog-Fenstern.
/// Wird vom DialogWatcher überwacht und bei Erkennung sofort ausgeführt.
/// </summary>
public class DialogRule
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Enabled { get; set; } = true;
    public int Priority { get; set; } = 100;

    // --- Erkennung ---
    public DialogMatchMethod MatchMethod { get; set; } = DialogMatchMethod.ContainsTitle;
    public string MatchPattern { get; set; } = string.Empty;

    /// <summary>Optionaler Prozessname-Filter</summary>
    public string? ProcessNameFilter { get; set; }

    /// <summary>Optionaler Klassen-Name-Filter</summary>
    public string? ClassNameFilter { get; set; }

    /// <summary>Zusätzliche Textinhalte im Dialog, die übereinstimmen müssen</summary>
    public List<string> RequiredContentPatterns { get; set; } = new();

    // --- Reaktion ---
    public DialogAction Action { get; set; } = DialogAction.ClickButton;

    /// <summary>Button-Text, der geklickt werden soll (bei ClickButton)</summary>
    public string? ButtonText { get; set; }

    /// <summary>Button-AutomationId (Alternative zu ButtonText)</summary>
    public string? ButtonAutomationId { get; set; }

    /// <summary>Tasten, die gesendet werden (bei SendKeys)</summary>
    public string? SendKeysSequence { get; set; }

    /// <summary>Funktions-ID, die aufgerufen wird (bei RunFunction)</summary>
    public string? FunctionId { get; set; }

    // --- Logging ---
    public bool LogOccurrence { get; set; } = true;
    public bool TakeScreenshot { get; set; }

    // --- Timing ---
    /// <summary>Wartezeit nach Erkennung bevor Reaktion (ms)</summary>
    public int DelayBeforeActionMs { get; set; } = 500;

    /// <summary>Cooldown: Früheste erneute Auslösung (ms)</summary>
    public int CooldownMs { get; set; } = 2000;

    /// <summary>Max. Auslösungen pro Workflow-Lauf (0 = unbegrenzt)</summary>
    public int MaxTriggersPerRun { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime ModifiedAt { get; set; } = DateTime.Now;
}
