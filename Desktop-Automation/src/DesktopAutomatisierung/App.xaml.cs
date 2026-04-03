namespace DesktopAutomatisierung;

public partial class App : System.Windows.Application
{
    protected override void OnStartup(System.Windows.StartupEventArgs e)
    {
        base.OnStartup(e);

        // Unbehandelte Exceptions abfangen
        DispatcherUnhandledException += (_, args) =>
        {
            System.Windows.MessageBox.Show(
                $"Ein unerwarteter Fehler ist aufgetreten:\n\n{args.Exception.Message}",
                "Fehler – Desktop-Automatisierung",
                System.Windows.MessageBoxButton.OK,
                System.Windows.MessageBoxImage.Error);
            args.Handled = true;
        };
    }
}
