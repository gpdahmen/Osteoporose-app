using System.Windows;
using DesktopAutomatisierung.ViewModels;

namespace DesktopAutomatisierung;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    protected override void OnClosed(EventArgs e)
    {
        if (DataContext is MainViewModel vm)
            vm.Cleanup();

        base.OnClosed(e);
    }
}
