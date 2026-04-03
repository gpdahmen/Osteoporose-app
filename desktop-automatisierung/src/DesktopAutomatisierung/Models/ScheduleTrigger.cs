using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DesktopAutomatisierung.Models;

/// <summary>
/// Trigger-Typ: Wann wird der Workflow ausgelöst?
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum TriggerType
{
    /// <summary>Einmalig zu einem bestimmten Zeitpunkt</summary>
    OneTime,

    /// <summary>Intervall-basiert (alle X Minuten/Stunden)</summary>
    Interval,

    /// <summary>Täglich zu einer festen Uhrzeit</summary>
    Daily,

    /// <summary>An bestimmten Wochentagen</summary>
    Weekly,

    /// <summary>Monatlich an bestimmtem Tag</summary>
    Monthly,

    /// <summary>Beim Start eines bestimmten Prozesses</summary>
    ProcessStart,

    /// <summary>Beim Beenden eines bestimmten Prozesses</summary>
    ProcessExit,

    /// <summary>Wenn ein bestimmtes Fenster erscheint</summary>
    WindowAppears,

    /// <summary>Wenn ein bestimmtes Fenster verschwindet</summary>
    WindowDisappears,

    /// <summary>Bei Änderung einer Datei/eines Ordners</summary>
    FileChange,

    /// <summary>Bei Systemstart / Benutzeranmeldung</summary>
    SystemLogin,

    /// <summary>Bei Hotkey-Kombination</summary>
    Hotkey,

    /// <summary>Manuell über die UI</summary>
    Manual
}

/// <summary>
/// Trigger zum zeitlichen oder eventbasierten Auslösen von Workflows.
/// Mehrere Trigger können einem Workflow zugeordnet werden.
/// </summary>
public class ScheduleTrigger
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public TriggerType Type { get; set; } = TriggerType.Manual;
    public bool Enabled { get; set; } = true;

    // --- Zeitbasiert ---
    /// <summary>Startzeit (bei OneTime, Daily, Weekly, Monthly)</summary>
    public DateTime? StartTime { get; set; }

    /// <summary>Uhrzeit (bei Daily, Weekly, Monthly)</summary>
    public TimeSpan? TimeOfDay { get; set; }

    /// <summary>Intervall in Minuten (bei Interval)</summary>
    public int IntervalMinutes { get; set; } = 60;

    /// <summary>Wochentage (bei Weekly) - 0=Sonntag .. 6=Samstag</summary>
    public List<DayOfWeek> DaysOfWeek { get; set; } = new();

    /// <summary>Tag des Monats (bei Monthly)</summary>
    public int DayOfMonth { get; set; } = 1;

    /// <summary>Endzeitpunkt, nach dem Trigger deaktiviert wird</summary>
    public DateTime? ExpiresAt { get; set; }

    // --- Eventbasiert ---
    /// <summary>Prozessname (bei ProcessStart/ProcessExit)</summary>
    public string? ProcessName { get; set; }

    /// <summary>Fenstertitel-Pattern (bei WindowAppears/WindowDisappears)</summary>
    public string? WindowTitlePattern { get; set; }

    /// <summary>Datei-/Ordnerpfad (bei FileChange)</summary>
    public string? WatchPath { get; set; }

    /// <summary>Dateifilter (bei FileChange, z.B. "*.pdf")</summary>
    public string? FileFilter { get; set; }

    // --- Hotkey ---
    /// <summary>Hotkey-Kombination (z.B. "Ctrl+Alt+F1")</summary>
    public string? HotkeyCombo { get; set; }

    // --- Steuerung ---
    /// <summary>Verzögerung nach Auslösung bevor Start (Sekunden)</summary>
    public int DelayBeforeStartSec { get; set; }

    /// <summary>Nicht erneut auslösen, wenn Workflow bereits läuft</summary>
    public bool PreventConcurrentRun { get; set; } = true;

    /// <summary>Max. Ausführungen (0 = unbegrenzt)</summary>
    public int MaxExecutions { get; set; }

    /// <summary>Bisherige Ausführungen</summary>
    public int ExecutionCount { get; set; }

    /// <summary>Letzte Auslösung</summary>
    public DateTime? LastTriggeredAt { get; set; }

    /// <summary>Nächste geplante Auslösung</summary>
    [JsonIgnore]
    public DateTime? NextTriggerAt { get; set; }
}
