# ============================================================
# OsteoDoc – Voraussetzungen-Installer fuer Windows
#
# Installiert automatisch:
#   - Node.js 20 LTS
#   - PostgreSQL 16
#
# Verwendung:
#   PowerShell als Administrator oeffnen und ausfuehren:
#   Set-ExecutionPolicy Bypass -Scope Process -Force
#   .\install-prerequisites-windows.ps1
#
# Nach der Installation:
#   install-windows.bat als Administrator ausfuehren
# ============================================================

#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

# ─── Konfiguration ──────────────────────────────────────────
$NodeVersion    = "20.18.1"
$NodeMsi        = "node-v${NodeVersion}-x64.msi"
$NodeUrl        = "https://nodejs.org/dist/v${NodeVersion}/${NodeMsi}"

$PgVersion      = "16"
$PgFullVersion  = "16.6-1"
$PgExe          = "postgresql-${PgFullVersion}-windows-x64.exe"
$PgUrl          = "https://get.enterprisedb.com/postgresql/${PgExe}"

$DownloadDir    = "$env:TEMP\osteodoc-install"
$PgInstallDir   = "C:\Program Files\PostgreSQL\${PgVersion}"

# ─── Hilfsfunktionen ────────────────────────────────────────

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Cyan
}

function Write-Ok {
    param([string]$Message)
    Write-Host "  $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "  WARNUNG: $Message" -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Message)
    Write-Host "  FEHLER: $Message" -ForegroundColor Red
}

# ─── Start ───────────────────────────────────────────────────
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  OsteoDoc - Voraussetzungen-Installer (Windows)" -ForegroundColor Green
Write-Host "  Installiert Node.js und PostgreSQL automatisch" -ForegroundColor Green
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""

# Download-Verzeichnis erstellen
if (-not (Test-Path $DownloadDir)) {
    New-Item -ItemType Directory -Path $DownloadDir -Force | Out-Null
}

# ─── Schritt 1: Node.js ─────────────────────────────────────
Write-Step "[1/2] Node.js $NodeVersion pruefen / installieren..."

$nodeInstalled = $false
try {
    $nodeVer = & node --version 2>$null
    if ($nodeVer) {
        $major = [int]($nodeVer -replace '^v','').Split('.')[0]
        if ($major -ge 18) {
            Write-Ok "Node.js $nodeVer ist bereits installiert. Ueberspringe."
            $nodeInstalled = $true
        } else {
            Write-Warn "Node.js $nodeVer ist zu alt (mind. v18 erforderlich). Aktualisiere..."
        }
    }
} catch {
    # Node.js nicht gefunden
}

if (-not $nodeInstalled) {
    $nodeMsiPath = Join-Path $DownloadDir $NodeMsi

    if (-not (Test-Path $nodeMsiPath)) {
        Write-Host "  Lade Node.js $NodeVersion herunter..."
        Write-Host "  URL: $NodeUrl"
        Write-Host ""

        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            $ProgressPreference = 'SilentlyContinue'
            Invoke-WebRequest -Uri $NodeUrl -OutFile $nodeMsiPath -UseBasicParsing
            Write-Ok "Download abgeschlossen."
        } catch {
            Write-Err "Download fehlgeschlagen: $_"
            Write-Host ""
            Write-Host "  Bitte Node.js manuell herunterladen:" -ForegroundColor Yellow
            Write-Host "  https://nodejs.org/de/download/" -ForegroundColor Yellow
            Write-Host ""
            exit 1
        }
    } else {
        Write-Ok "Installer bereits vorhanden: $nodeMsiPath"
    }

    Write-Host "  Installiere Node.js $NodeVersion (bitte warten)..."
    $msiArgs = "/i `"$nodeMsiPath`" /qn /norestart ADDLOCAL=ALL"
    $process = Start-Process -FilePath "msiexec.exe" -ArgumentList $msiArgs -Wait -PassThru -NoNewWindow
    if ($process.ExitCode -ne 0) {
        Write-Err "Node.js Installation fehlgeschlagen (Exit-Code: $($process.ExitCode))."
        Write-Host "  Versuche manuelle Installation..."
        Start-Process -FilePath $nodeMsiPath -Wait
    }

    # PATH aktualisieren
    $nodePath = "C:\Program Files\nodejs"
    if (Test-Path $nodePath) {
        $env:PATH = "$nodePath;$env:PATH"
        # Permanent zum System-PATH hinzufuegen
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
        if ($currentPath -notlike "*$nodePath*") {
            [Environment]::SetEnvironmentVariable("Path", "$currentPath;$nodePath", "Machine")
        }
    }

    # Pruefen ob Installation erfolgreich war
    try {
        $nodeVer = & "$nodePath\node.exe" --version 2>$null
        Write-Ok "Node.js $nodeVer erfolgreich installiert."
    } catch {
        Write-Err "Node.js konnte nach der Installation nicht gefunden werden."
        Write-Host "  Bitte starten Sie den Computer neu und fuehren Sie das Skript erneut aus."
        exit 1
    }
}

# ─── Schritt 2: PostgreSQL ──────────────────────────────────
Write-Step "[2/2] PostgreSQL $PgVersion pruefen / installieren..."

$pgInstalled = $false

# Pruefen ob PostgreSQL bereits installiert ist
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)

foreach ($p in $psqlPaths) {
    if (Test-Path $p) {
        Write-Ok "PostgreSQL bereits installiert: $p"
        $pgInstalled = $true
        $pgBinDir = Split-Path $p
        break
    }
}

# Auch im PATH pruefen
if (-not $pgInstalled) {
    try {
        $psqlPath = & where.exe psql 2>$null
        if ($psqlPath) {
            Write-Ok "PostgreSQL bereits im PATH: $psqlPath"
            $pgInstalled = $true
        }
    } catch {}
}

if (-not $pgInstalled) {
    $pgExePath = Join-Path $DownloadDir $PgExe

    if (-not (Test-Path $pgExePath)) {
        Write-Host "  Lade PostgreSQL $PgFullVersion herunter..."
        Write-Host "  URL: $PgUrl"
        Write-Host "  (ca. 300 MB - dies kann einige Minuten dauern)"
        Write-Host ""

        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            $ProgressPreference = 'SilentlyContinue'
            Invoke-WebRequest -Uri $PgUrl -OutFile $pgExePath -UseBasicParsing
            Write-Ok "Download abgeschlossen."
        } catch {
            Write-Err "Download fehlgeschlagen: $_"
            Write-Host ""
            Write-Host "  Bitte PostgreSQL manuell herunterladen:" -ForegroundColor Yellow
            Write-Host "  https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
            Write-Host ""
            exit 1
        }
    } else {
        Write-Ok "Installer bereits vorhanden: $pgExePath"
    }

    # PostgreSQL-Passwort abfragen
    Write-Host ""
    $pgPassword = Read-Host "  PostgreSQL Superuser-Passwort festlegen (fuer Benutzer 'postgres')"
    if ([string]::IsNullOrWhiteSpace($pgPassword)) {
        $pgPassword = "postgres"
        Write-Warn "Kein Passwort eingegeben. Verwende Standard-Passwort: 'postgres'"
    }

    Write-Host ""
    Write-Host "  Installiere PostgreSQL $PgVersion (bitte warten, kann einige Minuten dauern)..."

    $pgArgs = @(
        "--mode", "unattended",
        "--unattendedmodeui", "minimal",
        "--superpassword", $pgPassword,
        "--serverport", "5432",
        "--prefix", $PgInstallDir,
        "--datadir", "$PgInstallDir\data",
        "--install_runtimes", "0"
    )

    $process = Start-Process -FilePath $pgExePath -ArgumentList $pgArgs -Wait -PassThru -NoNewWindow
    if ($process.ExitCode -ne 0 -and $process.ExitCode -ne $null) {
        Write-Warn "Installer beendet mit Exit-Code $($process.ExitCode)."
        Write-Host "  Falls Probleme auftreten, bitte PostgreSQL manuell installieren:"
        Write-Host "  https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    }

    # PATH aktualisieren
    $pgBinDir = "$PgInstallDir\bin"
    if (Test-Path $pgBinDir) {
        $env:PATH = "$pgBinDir;$env:PATH"
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
        if ($currentPath -notlike "*$pgBinDir*") {
            [Environment]::SetEnvironmentVariable("Path", "$currentPath;$pgBinDir", "Machine")
        }
        Write-Ok "PostgreSQL erfolgreich installiert."
    } else {
        Write-Err "PostgreSQL-Verzeichnis nicht gefunden: $pgBinDir"
        Write-Host "  Bitte PostgreSQL manuell installieren und das Skript erneut ausfuehren."
        exit 1
    }

    # PostgreSQL-Dienst pruefen
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgService) {
        if ($pgService.Status -ne "Running") {
            Start-Service $pgService.Name
        }
        Write-Ok "PostgreSQL-Dienst laeuft: $($pgService.Name)"
    } else {
        Write-Warn "PostgreSQL-Dienst nicht gefunden. Bitte manuell starten."
    }
} else {
    # PATH aktualisieren falls noetig
    if ($pgBinDir) {
        $env:PATH = "$pgBinDir;$env:PATH"
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
        if ($currentPath -notlike "*$pgBinDir*") {
            [Environment]::SetEnvironmentVariable("Path", "$currentPath;$pgBinDir", "Machine")
        }
    }
}

# ─── Zusammenfassung ─────────────────────────────────────────
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Voraussetzungen erfolgreich installiert!" -ForegroundColor Green
Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""

# Versionen anzeigen
Write-Host "  Installierte Versionen:" -ForegroundColor Cyan
try {
    $nv = & node --version 2>$null
    Write-Host "    Node.js:    $nv"
} catch {
    Write-Host "    Node.js:    (Neustart erforderlich fuer PATH-Aktualisierung)" -ForegroundColor Yellow
}
try {
    $npmv = & npm --version 2>$null
    Write-Host "    npm:        v$npmv"
} catch {}
try {
    $pgv = & psql --version 2>$null
    Write-Host "    PostgreSQL: $pgv"
} catch {
    Write-Host "    PostgreSQL: (Neustart erforderlich fuer PATH-Aktualisierung)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  Naechster Schritt:" -ForegroundColor Cyan
Write-Host "    1. Falls noetig: Computer neu starten (damit PATH-Aenderungen wirksam werden)"
Write-Host "    2. install-windows.bat als Administrator ausfuehren"
Write-Host "       (Rechtsklick > 'Als Administrator ausfuehren')"
Write-Host ""

# Aufraemen anbieten
$cleanup = Read-Host "  Download-Dateien loeschen? (j/n)"
if ($cleanup -eq "j" -or $cleanup -eq "J" -or $cleanup -eq "ja") {
    Remove-Item -Path $DownloadDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Ok "Download-Dateien geloescht."
}

Write-Host ""
Write-Host "  Fertig! Druecken Sie eine beliebige Taste zum Beenden..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
