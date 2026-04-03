using System.Windows;

namespace DesktopAutomatisierung;

public partial class App : System.Windows.Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        // Unbehandelte Exceptions abfangen
        DispatcherUnhandledException += (_, args) =>
        {
            MessageBox.Show(
                $"Ein unerwarteter Fehler ist aufgetreten:\n\n{args.Exception.Message}",
                "Fehler – Desktop-Automatisierung",
                MessageBoxButton.OK,
                MessageBoxImage.Error);
            args.Handled = true;
        };
    }
}
