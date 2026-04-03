using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DesktopAutomatisierung.Models;

/// <summary>
/// Kategorie einer Automatisierungsfunktion
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum FunctionCategory
{
    Allgemein,
    Patientenverwaltung,
    Dokumentation,
    Abrechnung,
    Bildgebung,
    Labor,
    Kommunikation,
    Dateiverwaltung,
    Drucken,
    Benutzerdefiniert
}

/// <summary>
/// Ein Parameter, der beim Aufruf einer Funktion übergeben werden kann
/// </summary>
public class FunctionParameter
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DataType { get; set; } = "string";
    public string? DefaultValue { get; set; }
    public bool Required { get; set; } = true;
    public List<string>? AllowedValues { get; set; }
}

/// <summary>
/// Eine wiederverwendbare Automatisierungsfunktion, bestehend aus aufgezeichneten Aktionen.
/// Kann in der Bibliothek gespeichert und in Workflows eingebunden werden.
/// </summary>
public class AutomationFunction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public FunctionCategory Category { get; set; } = FunctionCategory.Allgemein;
    public List<string> Tags { get; set; } = new();
    public string Version { get; set; } = "1.0.0";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime ModifiedAt { get; set; } = DateTime.Now;

    /// <summary>Zielprogramm, für das diese Funktion erstellt wurde</summary>
    public string TargetApplication { get; set; } = string.Empty;

    /// <summary>Prozessname des Zielprogramms (z.B. "outlook.exe")</summary>
    public string TargetProcessName { get; set; } = string.Empty;

    /// <summary>Die aufgezeichneten Aktionen dieser Funktion</summary>
    public List<RecordedAction> Actions { get; set; } = new();

    /// <summary>Parameter, die beim Aufruf übergeben werden können</summary>
    public List<FunctionParameter> Parameters { get; set; } = new();

    /// <summary>Dialog-Regeln, die während der Ausführung aktiv sein sollen</summary>
    public List<string> ActiveDialogRuleIds { get; set; } = new();

    /// <summary>Vorbedingungen, die vor Ausführung geprüft werden</summary>
    public List<string> Preconditions { get; set; } = new();

    /// <summary>Max. Ausführungszeit in Sekunden (0 = unbegrenzt)</summary>
    public int MaxExecutionTimeSec { get; set; }

    /// <summary>Verhalten bei Fehler</summary>
    public ErrorBehavior OnError { get; set; } = ErrorBehavior.StopAndNotify;

    public AutomationFunction Clone()
    {
        var json = JsonConvert.SerializeObject(this);
        var clone = JsonConvert.DeserializeObject<AutomationFunction>(json)!;
        clone.Id = Guid.NewGuid().ToString();
        clone.Name += " (Kopie)";
        clone.CreatedAt = DateTime.Now;
        clone.ModifiedAt = DateTime.Now;
        return clone;
    }
}

[JsonConverter(typeof(StringEnumConverter))]
public enum ErrorBehavior
{
    StopAndNotify,
    RetryAction,
    SkipAction,
    RunErrorHandler,
    AbortWorkflow
}
