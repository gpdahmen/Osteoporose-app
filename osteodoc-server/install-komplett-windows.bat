@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

:: ============================================================
:: OsteoDoc – Komplette Ein-Klick-Installation fuer Windows
::
:: Diese EINZIGE Datei fuehrt die gesamte Installation durch:
::   1. Node.js pruefen / automatisch installieren
::   2. PostgreSQL pruefen / automatisch installieren
::   3. Datenbank einrichten
::   4. Konfiguration erstellen (.env)
::   5. npm-Pakete installieren und Frontend bauen
::   6. Datenbank initialisieren
::   7. Start-Skript und Desktop-Verknuepfung erstellen
::
:: Verwendung:
::   Rechtsklick → "Als Administrator ausfuehren"
:: ============================================================

title OsteoDoc – Komplette Installation

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   OsteoDoc – Komplette Ein-Klick-Installation            ║
echo ║   Osteoporose-Bewertung nach DVO-Leitlinie 2023         ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

:: ─── Administratorrechte pruefen ─────────────────────────────
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo   [FEHLER] Bitte als Administrator ausfuehren!
    echo.
    echo   So geht's:
    echo     Rechtsklick auf diese Datei
    echo     → "Als Administrator ausfuehren"
    echo.
    pause
    exit /b 1
)

:: Skript-Verzeichnis als Arbeitsverzeichnis
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
echo   Installationsverzeichnis: %SCRIPT_DIR%
echo.

:: Zeichensatz fuer Passwort-Generierung
set "CHARS=ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"

:: Temporaeres Download-Verzeichnis
set "DOWNLOAD_DIR=%TEMP%\osteodoc-install"
if not exist "%DOWNLOAD_DIR%" mkdir "%DOWNLOAD_DIR%"

:: ╔══════════════════════════════════════════════════════════════╗
:: ║  PHASE 1: VORAUSSETZUNGEN                                   ║
:: ╚══════════════════════════════════════════════════════════════╝

echo ══════════════════════════════════════════════════════════
echo   PHASE 1: Voraussetzungen pruefen und installieren
echo ══════════════════════════════════════════════════════════
echo.

:: ─── Schritt 1: Node.js pruefen / installieren ─────────────────
echo   [1/7] Node.js pruefen...

set "NODE_OK=0"
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%v in ('node --version 2^>nul') do set "NODE_VER=%%v"
    echo          Node.js !NODE_VER! gefunden.
    set "NODE_OK=1"
)

if "!NODE_OK!"=="0" (
    echo          Node.js nicht gefunden. Wird automatisch installiert...
    echo.
    echo          Lade Node.js 20 LTS herunter...

    powershell -ExecutionPolicy Bypass -Command ^
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; ^
         $ProgressPreference = 'SilentlyContinue'; ^
         Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi' ^
         -OutFile '%DOWNLOAD_DIR%\node-installer.msi' -UseBasicParsing"

    if not exist "%DOWNLOAD_DIR%\node-installer.msi" (
        echo.
        echo   [FEHLER] Node.js Download fehlgeschlagen!
        echo   Bitte manuell installieren: https://nodejs.org/de/download/
        echo   Danach dieses Skript erneut ausfuehren.
        echo.
        pause
        exit /b 1
    )

    echo          Installiere Node.js (bitte warten)...
    msiexec /i "%DOWNLOAD_DIR%\node-installer.msi" /qn /norestart ADDLOCAL=ALL

    :: PATH aktualisieren
    set "PATH=C:\Program Files\nodejs;!PATH!"

    :: Permanent zum System-PATH
    powershell -ExecutionPolicy Bypass -Command ^
        "$p = [Environment]::GetEnvironmentVariable('Path','Machine'); ^
         if ($p -notlike '*nodejs*') { ^
           [Environment]::SetEnvironmentVariable('Path', $p + ';C:\Program Files\nodejs', 'Machine') ^
         }"

    where node >nul 2>&1
    if %errorlevel% neq 0 (
        :: Fallback: Direkter Pfad
        if exist "C:\Program Files\nodejs\node.exe" (
            set "PATH=C:\Program Files\nodejs;!PATH!"
        ) else (
            echo.
            echo   [FEHLER] Node.js Installation fehlgeschlagen!
            echo   Bitte manuell installieren: https://nodejs.org/de/download/
            echo   Danach dieses Skript erneut ausfuehren.
            echo.
            pause
            exit /b 1
        )
    )

    for /f "tokens=*" %%v in ('node --version 2^>nul') do set "NODE_VER=%%v"
    echo          Node.js !NODE_VER! erfolgreich installiert. [OK]
)
echo          [OK]
echo.

:: ─── Schritt 2: PostgreSQL pruefen / installieren ──────────────
echo   [2/7] PostgreSQL pruefen...

set "PG_OK=0"
set "PG_BIN="

:: Im PATH suchen
where psql >nul 2>&1
if %errorlevel% equ 0 (
    set "PG_OK=1"
    echo          PostgreSQL im PATH gefunden.
)

:: Standard-Installationspfade pruefen
if "!PG_OK!"=="0" (
    for %%p in (
        "C:\Program Files\PostgreSQL\17\bin"
        "C:\Program Files\PostgreSQL\16\bin"
        "C:\Program Files\PostgreSQL\15\bin"
        "C:\Program Files\PostgreSQL\14\bin"
    ) do (
        if exist "%%~p\psql.exe" (
            set "PG_BIN=%%~p"
            set "PATH=%%~p;!PATH!"
            set "PG_OK=1"
            echo          PostgreSQL gefunden in: %%~p
        )
    )
)

if "!PG_OK!"=="0" (
    echo          PostgreSQL nicht gefunden. Wird automatisch installiert...
    echo.
    echo          Lade PostgreSQL 16 herunter (ca. 300 MB)...
    echo          Dies kann einige Minuten dauern...
    echo.

    powershell -ExecutionPolicy Bypass -Command ^
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; ^
         $ProgressPreference = 'SilentlyContinue'; ^
         Invoke-WebRequest -Uri 'https://get.enterprisedb.com/postgresql/postgresql-16.6-1-windows-x64.exe' ^
         -OutFile '%DOWNLOAD_DIR%\postgresql-installer.exe' -UseBasicParsing"

    if not exist "%DOWNLOAD_DIR%\postgresql-installer.exe" (
        echo.
        echo   [FEHLER] PostgreSQL Download fehlgeschlagen!
        echo   Bitte manuell installieren: https://www.postgresql.org/download/windows/
        echo   Danach dieses Skript erneut ausfuehren.
        echo.
        pause
        exit /b 1
    )

    :: PostgreSQL-Passwort abfragen
    echo.
    set /p "PG_INSTALL_PASS=  PostgreSQL Superuser-Passwort festlegen: "
    if "!PG_INSTALL_PASS!"=="" (
        set "PG_INSTALL_PASS=postgres"
        echo          Kein Passwort eingegeben. Verwende Standard: 'postgres'
    )

    echo.
    echo          Installiere PostgreSQL 16 (bitte warten, kann einige Minuten dauern)...

    "%DOWNLOAD_DIR%\postgresql-installer.exe" ^
        --mode unattended ^
        --unattendedmodeui minimal ^
        --superpassword "!PG_INSTALL_PASS!" ^
        --serverport 5432 ^
        --prefix "C:\Program Files\PostgreSQL\16" ^
        --datadir "C:\Program Files\PostgreSQL\16\data" ^
        --install_runtimes 0

    set "PG_BIN=C:\Program Files\PostgreSQL\16\bin"

    if exist "!PG_BIN!\psql.exe" (
        set "PATH=!PG_BIN!;!PATH!"

        :: Permanent zum System-PATH
        powershell -ExecutionPolicy Bypass -Command ^
            "$p = [Environment]::GetEnvironmentVariable('Path','Machine'); ^
             if ($p -notlike '*PostgreSQL*') { ^
               [Environment]::SetEnvironmentVariable('Path', $p + ';C:\Program Files\PostgreSQL\16\bin', 'Machine') ^
             }"

        echo          PostgreSQL 16 erfolgreich installiert. [OK]
    ) else (
        echo.
        echo   [FEHLER] PostgreSQL Installation fehlgeschlagen!
        echo   Bitte manuell installieren: https://www.postgresql.org/download/windows/
        echo   Danach dieses Skript erneut ausfuehren.
        echo.
        pause
        exit /b 1
    )

    :: Dienst starten falls noetig
    powershell -ExecutionPolicy Bypass -Command ^
        "$svc = Get-Service -Name 'postgresql*' -ErrorAction SilentlyContinue; ^
         if ($svc -and $svc.Status -ne 'Running') { Start-Service $svc.Name }"

    :: Kurz warten bis Dienst bereit
    timeout /t 3 /nobreak >nul
)
echo          [OK]
echo.

:: ╔══════════════════════════════════════════════════════════════╗
:: ║  PHASE 2: OSTEODOC EINRICHTEN                               ║
:: ╚══════════════════════════════════════════════════════════════╝

echo ══════════════════════════════════════════════════════════
echo   PHASE 2: OsteoDoc einrichten
echo ══════════════════════════════════════════════════════════
echo.

:: ─── Schritt 3: PostgreSQL-Datenbank einrichten ────────────────
echo   [3/7] PostgreSQL-Datenbank einrichten...
echo.

:: Passwort fuer postgres-Benutzer abfragen (falls nicht schon gesetzt)
if not defined PG_INSTALL_PASS (
    set /p "PG_ADMIN_PASS=  PostgreSQL 'postgres'-Passwort eingeben: "
) else (
    set "PG_ADMIN_PASS=!PG_INSTALL_PASS!"
)
echo.

set "PGPASSWORD=!PG_ADMIN_PASS!"

:: Verbindung testen
psql -U postgres -h localhost -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo   [FEHLER] Konnte keine Verbindung zu PostgreSQL herstellen.
    echo   Bitte pruefen:
    echo   - Ist PostgreSQL gestartet?
    echo   - Ist das Passwort korrekt?
    echo.
    pause
    exit /b 1
)
echo          PostgreSQL-Verbindung erfolgreich.

:: Zufaelliges DB-Passwort generieren
set "DB_PASSWORD="
for /L %%i in (1,1,24) do (
    set /a "idx=!random! %% 57"
    for %%j in (!idx!) do set "DB_PASSWORD=!DB_PASSWORD!!CHARS:~%%j,1!"
)

:: Benutzer erstellen
psql -U postgres -h localhost -tc "SELECT 1 FROM pg_roles WHERE rolname='osteodoc'" 2>nul | findstr "1" >nul 2>&1
if %errorlevel% neq 0 (
    psql -U postgres -h localhost -c "CREATE ROLE osteodoc WITH LOGIN PASSWORD '!DB_PASSWORD!';" >nul 2>&1
    echo          Datenbankbenutzer 'osteodoc' erstellt.
) else (
    psql -U postgres -h localhost -c "ALTER ROLE osteodoc WITH PASSWORD '!DB_PASSWORD!';" >nul 2>&1
    echo          Datenbankbenutzer 'osteodoc' existiert bereits (Passwort aktualisiert).
)

:: Datenbank erstellen
psql -U postgres -h localhost -tc "SELECT 1 FROM pg_database WHERE datname='osteodoc'" 2>nul | findstr "1" >nul 2>&1
if %errorlevel% neq 0 (
    psql -U postgres -h localhost -c "CREATE DATABASE osteodoc OWNER osteodoc;" >nul 2>&1
    echo          Datenbank 'osteodoc' erstellt.
) else (
    echo          Datenbank 'osteodoc' existiert bereits.
)

set "PGPASSWORD="
echo          [OK]
echo.

:: ─── Schritt 4: .env erstellen ─────────────────────────────────
echo   [4/7] Konfiguration erstellen (.env)...

:: JWT-Secret generieren
set "JWT_SECRET="
for /L %%i in (1,1,48) do (
    set /a "idx=!random! %% 57"
    for %%j in (!idx!) do set "JWT_SECRET=!JWT_SECRET!!CHARS:~%%j,1!"
)

:: Admin-Passwort generieren
set "ADMIN_PASSWORD="
for /L %%i in (1,1,16) do (
    set /a "idx=!random! %% 57"
    for %%j in (!idx!) do set "ADMIN_PASSWORD=!ADMIN_PASSWORD!!CHARS:~%%j,1!"
)

:: Bestehende .env sichern
if exist .env (
    copy .env ".env.backup" >nul 2>&1
    echo          Bestehende .env als .env.backup gesichert.
)

:: .env schreiben
(
    echo # OsteoDoc Konfiguration (automatisch generiert)
    echo PORT=3000
    echo NODE_ENV=production
    echo.
    echo # Datenbank (PostgreSQL)
    echo DB_HOST=localhost
    echo DB_PORT=5432
    echo DB_NAME=osteodoc
    echo DB_USER=osteodoc
    echo DB_PASSWORD=!DB_PASSWORD!
    echo.
    echo # JWT-Authentifizierung
    echo JWT_SECRET=!JWT_SECRET!
    echo JWT_EXPIRES_IN=8h
    echo.
    echo # Admin-Ersteinrichtung
    echo ADMIN_USERNAME=admin
    echo ADMIN_PASSWORD=!ADMIN_PASSWORD!
) > .env

echo          .env erstellt. [OK]
echo.

:: ─── Schritt 5: npm-Pakete und Build ───────────────────────────
echo   [5/7] npm-Pakete installieren und Frontend bauen...
echo.

echo          Server-Abhaengigkeiten installieren...
call npm install --production
if %errorlevel% neq 0 (
    echo   [FEHLER] npm install fehlgeschlagen!
    pause
    exit /b 1
)
echo          Server-Abhaengigkeiten [OK]

echo.
echo          Client-Abhaengigkeiten installieren...
cd client
call npm install
if %errorlevel% neq 0 (
    echo   [FEHLER] npm install (Client) fehlgeschlagen!
    pause
    exit /b 1
)

echo          Frontend bauen (Webpack)...
call npx webpack --mode production
if %errorlevel% neq 0 (
    echo   [FEHLER] Webpack-Build fehlgeschlagen!
    pause
    exit /b 1
)
cd /d "%SCRIPT_DIR%"
echo          Frontend-Build [OK]
echo.

:: ─── Schritt 6: Datenbank initialisieren ───────────────────────
echo   [6/7] Datenbank initialisieren...

node server/db/init.js
if %errorlevel% neq 0 (
    echo   [FEHLER] Datenbank-Initialisierung fehlgeschlagen!
    pause
    exit /b 1
)
echo          Datenbank initialisiert. [OK]
echo.

:: ─── Schritt 7: Start-Skript und Verknuepfungen ───────────────
echo   [7/7] Start-Skript und Verknuepfungen erstellen...

:: Start-Skript erstellen
(
    echo @echo off
    echo chcp 65001 ^>nul 2^>^&1
    echo title OsteoDoc Server
    echo cd /d "%SCRIPT_DIR%"
    echo echo.
    echo echo   ╔══════════════════════════════════════════════╗
    echo echo   ║  OsteoDoc Server laeuft                      ║
    echo echo   ║  URL: http://localhost:3000                  ║
    echo echo   ║  Zum Beenden: Strg+C oder Fenster schliessen ║
    echo echo   ╚══════════════════════════════════════════════╝
    echo echo.
    echo echo   Oeffne Browser...
    echo timeout /t 2 /nobreak ^>nul
    echo start http://localhost:3000
    echo node server/app.js
    echo pause
) > start-osteodoc.bat

echo          start-osteodoc.bat erstellt.

:: Desktop-Verknuepfung erstellen
set "DESKTOP=%USERPROFILE%\Desktop"
if exist "%DESKTOP%" (
    powershell -ExecutionPolicy Bypass -Command ^
        "$ws = New-Object -ComObject WScript.Shell; ^
         $sc = $ws.CreateShortcut('%DESKTOP%\OsteoDoc starten.lnk'); ^
         $sc.TargetPath = '%SCRIPT_DIR%start-osteodoc.bat'; ^
         $sc.WorkingDirectory = '%SCRIPT_DIR%'; ^
         $sc.Description = 'OsteoDoc Server starten'; ^
         $sc.Save()"
    echo          Desktop-Verknuepfung erstellt.
)

:: Stopp-Skript erstellen
(
    echo @echo off
    echo echo   OsteoDoc Server wird beendet...
    echo taskkill /f /im node.exe /fi "WINDOWTITLE eq OsteoDoc Server" ^>nul 2^>^&1
    echo for /f "tokens=5" %%%%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"'^) do taskkill /f /pid %%%%a ^>nul 2^>^&1
    echo echo   Server beendet.
    echo timeout /t 2 /nobreak ^>nul
) > stop-osteodoc.bat

echo          stop-osteodoc.bat erstellt.
echo          [OK]
echo.

:: ─── Download-Dateien aufraeumen ────────────────────────────────
if exist "%DOWNLOAD_DIR%" (
    echo.
    set /p "CLEANUP=  Download-Dateien loeschen? (j/n): "
    if /i "!CLEANUP!"=="j" (
        rmdir /s /q "%DOWNLOAD_DIR%" 2>nul
        echo          Download-Dateien geloescht.
    )
)

:: ╔══════════════════════════════════════════════════════════════╗
:: ║  FERTIG                                                      ║
:: ╚══════════════════════════════════════════════════════════════╝

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║   OsteoDoc erfolgreich installiert!                      ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo   Server starten:
echo     Doppelklick auf "start-osteodoc.bat"
echo     oder Desktop-Verknuepfung "OsteoDoc starten"
echo.
echo   Server-URL:        http://localhost:3000
echo.
echo   ┌─────────────────────────────────────────────┐
echo   │  Admin-Zugangsdaten:                        │
echo   │    Benutzername:  admin                     │
echo   │    Passwort:      !ADMIN_PASSWORD!
echo   │                                             │
echo   │  WICHTIG: Passwort nach Login aendern!      │
echo   └─────────────────────────────────────────────┘
echo.

:: Server jetzt starten?
echo.
set /p "START_NOW=  Server jetzt starten? (j/n): "
if /i "!START_NOW!"=="j" (
    echo.
    echo   Starte OsteoDoc Server...
    echo   URL: http://localhost:3000
    echo   Zum Beenden: Strg+C
    echo.
    timeout /t 2 /nobreak >nul
    start http://localhost:3000
    node server/app.js
) else (
    echo.
    echo   Server spaeter starten mit: start-osteodoc.bat
    echo.
)

pause
