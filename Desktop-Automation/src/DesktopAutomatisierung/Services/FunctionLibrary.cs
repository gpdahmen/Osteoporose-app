using System.IO;
using Newtonsoft.Json;
using DesktopAutomatisierung.Models;

namespace DesktopAutomatisierung.Services;

/// <summary>
/// Verwaltet die Bibliothek aller gespeicherten Automatisierungsfunktionen.
/// Persistiert auf Festplatte als JSON-Dateien.
/// </summary>
public class FunctionLibrary
{
    private readonly Dictionary<string, AutomationFunction> _functions = new();
    private readonly string _libraryPath;

    public event EventHandler? LibraryChanged;

    public FunctionLibrary(string? basePath = null)
    {
        _libraryPath = basePath ?? Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "DesktopAutomatisierung", "Library");

        Directory.CreateDirectory(_libraryPath);
    }

    public IReadOnlyCollection<AutomationFunction> GetAll() => _functions.Values.ToList().AsReadOnly();

    public AutomationFunction? GetById(string id) =>
        _functions.TryGetValue(id, out var func) ? func : null;

    public AutomationFunction? GetByName(string name) =>
        _functions.Values.FirstOrDefault(f => f.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

    public IEnumerable<AutomationFunction> GetByCategory(FunctionCategory category) =>
        _functions.Values.Where(f => f.Category == category);

    public IEnumerable<AutomationFunction> GetByApplication(string processName) =>
        _functions.Values.Where(f => f.TargetProcessName.Equals(processName, StringComparison.OrdinalIgnoreCase));

    public IEnumerable<AutomationFunction> Search(string query) =>
        _functions.Values.Where(f =>
            f.Name.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            f.Description.Contains(query, StringComparison.OrdinalIgnoreCase) ||
            f.Tags.Any(t => t.Contains(query, StringComparison.OrdinalIgnoreCase)) ||
            f.TargetApplication.Contains(query, StringComparison.OrdinalIgnoreCase));

    public void Save(AutomationFunction function)
    {
        function.ModifiedAt = DateTime.Now;
        _functions[function.Id] = function;

        var filePath = GetFilePath(function.Id);
        var json = JsonConvert.SerializeObject(function, Formatting.Indented);
        File.WriteAllText(filePath, json);

        LibraryChanged?.Invoke(this, EventArgs.Empty);
    }

    public AutomationFunction CreateFromRecording(string name, List<RecordedAction> actions,
        FunctionCategory category = FunctionCategory.Allgemein)
    {
        var function = new AutomationFunction
        {
            Name = name,
            Category = category,
            Actions = new List<RecordedAction>(actions)
        };

        // Zielanwendung aus den Aktionen ableiten
        var processNames = actions
            .Where(a => !string.IsNullOrEmpty(a.ProcessName))
            .Select(a => a.ProcessName!)
            .GroupBy(p => p)
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();

        if (processNames != null)
        {
            function.TargetProcessName = processNames.Key;
            function.TargetApplication = processNames.Key;
        }

        Save(function);
        return function;
    }

    public AutomationFunction Duplicate(string functionId)
    {
        var original = GetById(functionId)
            ?? throw new InvalidOperationException($"Funktion nicht gefunden: {functionId}");

        var clone = original.Clone();
        Save(clone);
        return clone;
    }

    public void Delete(string functionId)
    {
        if (_functions.Remove(functionId))
        {
            var filePath = GetFilePath(functionId);
            if (File.Exists(filePath))
                File.Delete(filePath);

            LibraryChanged?.Invoke(this, EventArgs.Empty);
        }
    }

    public void LoadAll()
    {
        _functions.Clear();

        if (!Directory.Exists(_libraryPath)) return;

        foreach (var file in Directory.GetFiles(_libraryPath, "*.json"))
        {
            try
            {
                var json = File.ReadAllText(file);
                var function = JsonConvert.DeserializeObject<AutomationFunction>(json);
                if (function != null)
                    _functions[function.Id] = function;
            }
            catch
            {
                // Fehlerhafte Datei überspringen
            }
        }
    }

    public void ExportFunction(string functionId, string exportPath)
    {
        var function = GetById(functionId)
            ?? throw new InvalidOperationException($"Funktion nicht gefunden: {functionId}");

        var json = JsonConvert.SerializeObject(function, Formatting.Indented);
        File.WriteAllText(exportPath, json);
    }

    public AutomationFunction ImportFunction(string importPath)
    {
        var json = File.ReadAllText(importPath);
        var function = JsonConvert.DeserializeObject<AutomationFunction>(json)
            ?? throw new InvalidOperationException("Ungültige Funktionsdatei.");

        // Neue ID vergeben um Konflikte zu vermeiden
        function.Id = Guid.NewGuid().ToString();
        function.CreatedAt = DateTime.Now;
        function.ModifiedAt = DateTime.Now;

        Save(function);
        return function;
    }

    /// <summary>Exportiert die gesamte Bibliothek als einzelne JSON-Datei</summary>
    public void ExportAll(string exportPath)
    {
        var allFunctions = _functions.Values.ToList();
        var json = JsonConvert.SerializeObject(allFunctions, Formatting.Indented);
        File.WriteAllText(exportPath, json);
    }

    /// <summary>Importiert eine exportierte Bibliothek</summary>
    public int ImportAll(string importPath)
    {
        var json = File.ReadAllText(importPath);
        var functions = JsonConvert.DeserializeObject<List<AutomationFunction>>(json);
        if (functions == null) return 0;

        int count = 0;
        foreach (var func in functions)
        {
            func.Id = Guid.NewGuid().ToString();
            func.CreatedAt = DateTime.Now;
            func.ModifiedAt = DateTime.Now;
            Save(func);
            count++;
        }

        return count;
    }

    private string GetFilePath(string functionId) =>
        Path.Combine(_libraryPath, $"{functionId}.json");
}
