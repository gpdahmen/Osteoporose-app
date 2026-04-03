using System.Windows;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DesktopAutomatisierung.Models;

/// <summary>
/// Typ der aufgezeichneten Aktion
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum ActionType
{
    MouseClick,
    MouseDoubleClick,
    MouseRightClick,
    MouseMove,
    MouseDrag,
    MouseScroll,
    KeyPress,
    KeyCombination,
    TextInput,
    UIElementClick,
    UIElementSetValue,
    UIElementSelect,
    WindowActivate,
    WindowClose,
    WindowResize,
    WindowMove,
    Wait,
    WaitForElement,
    WaitForWindow,
    Screenshot,
    Assertion,
    Custom
}

/// <summary>
/// Mausknopf
/// </summary>
[JsonConverter(typeof(StringEnumConverter))]
public enum MouseButton
{
    Left,
    Right,
    Middle
}

/// <summary>
/// Einzelne aufgezeichnete Aktion innerhalb eines Workflows
/// </summary>
public class RecordedAction
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public ActionType Type { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;

    /// <summary>Zeitverzögerung zur vorherigen Aktion in Millisekunden</summary>
    public int DelayMs { get; set; }

    /// <summary>Optionaler Beschreibungstext für den Editor</summary>
    public string Description { get; set; } = string.Empty;

    // --- Maus-Daten ---
    public int X { get; set; }
    public int Y { get; set; }
    public int EndX { get; set; }
    public int EndY { get; set; }
    public MouseButton Button { get; set; } = MouseButton.Left;
    public int ScrollDelta { get; set; }

    // --- Tastatur-Daten ---
    public int KeyCode { get; set; }
    public string KeyName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public bool ModifierCtrl { get; set; }
    public bool ModifierAlt { get; set; }
    public bool ModifierShift { get; set; }
    public bool ModifierWin { get; set; }

    // --- UI-Automation-Daten ---
    public string? AutomationId { get; set; }
    public string? ControlName { get; set; }
    public string? ControlType { get; set; }
    public string? ClassName { get; set; }
    public string? WindowTitle { get; set; }
    public string? ProcessName { get; set; }
    public string? XPath { get; set; }
    public string? Value { get; set; }

    // --- Screenshot bei Aufnahme (Base64, optional) ---
    public string? ScreenshotBase64 { get; set; }

    // --- Erweiterte Einstellungen ---
    public int TimeoutMs { get; set; } = 10000;
    public int RetryCount { get; set; } = 3;
    public bool ContinueOnError { get; set; }
    public string? ErrorHandler { get; set; }

    // --- Assertion ---
    public string? ExpectedValue { get; set; }
    public string? AssertionType { get; set; }

    public RecordedAction Clone()
    {
        var json = JsonConvert.SerializeObject(this);
        return JsonConvert.DeserializeObject<RecordedAction>(json)!;
    }

    public override string ToString()
    {
        return Type switch
        {
            ActionType.MouseClick => $"Klick ({X}, {Y}) auf '{WindowTitle}'",
            ActionType.MouseDoubleClick => $"Doppelklick ({X}, {Y}) auf '{WindowTitle}'",
            ActionType.KeyPress => $"Taste: {KeyName}",
            ActionType.KeyCombination => $"Kombination: {FormatKeyCombination()}",
            ActionType.TextInput => $"Texteingabe: \"{(Text.Length > 30 ? Text[..30] + "…" : Text)}\"",
            ActionType.UIElementClick => $"UI-Klick: {ControlName ?? AutomationId ?? ControlType}",
            ActionType.UIElementSetValue => $"Wert setzen: {ControlName} = \"{Value}\"",
            ActionType.WindowActivate => $"Fenster aktivieren: '{WindowTitle}'",
            ActionType.WaitForWindow => $"Warten auf Fenster: '{WindowTitle}'",
            ActionType.WaitForElement => $"Warten auf Element: {ControlName ?? AutomationId}",
            ActionType.Wait => $"Warten: {DelayMs}ms",
            _ => $"{Type}: {Description}"
        };
    }

    private string FormatKeyCombination()
    {
        var parts = new List<string>();
        if (ModifierCtrl) parts.Add("Strg");
        if (ModifierAlt) parts.Add("Alt");
        if (ModifierShift) parts.Add("Umschalt");
        if (ModifierWin) parts.Add("Win");
        parts.Add(KeyName);
        return string.Join("+", parts);
    }
}
