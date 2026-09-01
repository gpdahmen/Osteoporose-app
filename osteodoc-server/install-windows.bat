@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

:: ============================================================
:: OsteoDoc – Installationsskript fuer Windows
::
:: Verwendung:
::   Rechtsklick auf install-windows.bat → "Als Administrator ausfuehren"
::
:: Voraussetzungen (werden automatisch geprueft):
::   - Node.js >= 18 (https://nodejs.org)
::   - PostgreSQL   (https://www.postgresql.org/download/windows/)
::
:: Dieses Skript richtet die Datenbank ein, installiert
:: Abhaengigkeiten, baut das Frontend und startet den Server.
:: ============================================================

echo.
echo ======================================================
echo.
echo     OsteoDoc – Server-Installation (Windows)
echo     Osteoporose-Bewertung nach DVO 2023
echo.
echo ======================================================
echo.

:: ─── Administratorrechte pruefen ─────────────────────────────
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [FEHLER] Bitte als Administrator ausfuehren!
    echo          Rechtsklick auf die Datei ^> "Als Administrator ausfuehren"
    echo.
    pause
    exit /b 1
)

:: Skript-Verzeichnis als Arbeitsverzeichnis
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
echo   Installationsverzeichnis: %SCRIPT_DIR%

:: ─── Schritt 1: Node.js pruefen ──────────────────────────────
echo.
echo ──────────────────────────────────────────────────────
echo   [1/6] Node.js pruefen...
echo ──────────────────────────────────────────────────────

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [FEHLER] Node.js ist nicht installiert!
    echo.
    echo   Bitte Node.js 20 LTS herunterladen und installieren:
    echo   https://nodejs.org/de/download/
    echo.
    echo   Nach der Installation dieses Skript erneut ausfuehren.
    echo.
    pause
    exit /b 1
)

for /f "tokens=1 delims=v." %%a in ('node --version') do set NODE_MAJOR=%%a
for /f "tokens=2 delims=v." %%a in ('node --version') do set NODE_MAJOR=%%a

echo   Node.js gefunden:
node --version
echo   npm gefunden:
call npm --version
echo   [OK]

:: ─── Schritt 2: PostgreSQL pruefen ───────────────────────────
echo.
echo ──────────────────────────────────────────────────────
echo   [2/6] PostgreSQL pruefen...
echo ──────────────────────────────────────────────────────

where psql >nul 2>&1
if %errorlevel% neq 0 (
    :: Versuche Standard-Installationspfade
    set "PGFOUND=0"
    for %%p in (
        "C:\Program Files\PostgreSQL\16\bin"
        "C:\Program Files\PostgreSQL\15\bin"
        "C:\Program Files\PostgreSQL\14\bin"
        "C:\Program Files\PostgreSQL\17\bin"
    ) do (
        if exist "%%~p\psql.exe" (
            set "PATH=%%~p;!PATH!"
            set "PGFOUND=1"
            echo   PostgreSQL gefunden in: %%~p
        )
    )
    if "!PGFOUND!"=="0" (
        echo [FEHLER] PostgreSQL ist nicht installiert oder nicht im PATH!
        echo.
        echo   Bitte PostgreSQL herunterladen und installieren:
        echo   https://www.postgresql.org/download/windows/
        echo.
        echo   Wichtig: Bei der Installation das Passwort fuer den
        echo   Benutzer "postgres" merken!
        echo.
        echo   Nach der Installation dieses Skript erneut ausfuehren.
        echo.
        pause
        exit /b 1
    )
)

echo   PostgreSQL [OK]

:: ─── Schritt 3: Datenbank einrichten ─────────────────────────
echo.
echo ──────────────────────────────────────────────────────
echo   [3/6] PostgreSQL-Datenbank einrichten...
echo ──────────────────────────────────────────────────────

:: Passwort fuer postgres-Benutzer abfragen
echo.
set /p "PG_ADMIN_PASS=  PostgreSQL 'postgres'-Passwort eingeben: "
echo.

set "PGPASSWORD=%PG_ADMIN_PASS%"

:: Verbindung testen
psql -U postgres -h localhost -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [FEHLER] Konnte keine Verbindung zu PostgreSQL herstellen.
    echo   Bitte pruefen Sie:
    echo   - Ist PostgreSQL gestartet? (Dienste-Manager pruefen)
    echo   - Ist das Passwort korrekt?
    echo.
    pause
    exit /b 1
)

echo   PostgreSQL-Verbindung erfolgreich.

:: Zufaelliges DB-Passwort generieren (einfache Methode fuer Windows)
set "CHARS=ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
set "DB_PASSWORD="
for /L %%i in (1,1,24) do (
    set /a "idx=!random! %% 57"
    for %%j in (!idx!) do set "DB_PASSWORD=!DB_PASSWORD!!CHARS:~%%j,1!"
)

:: Benutzer erstellen
psql -U postgres -h localhost -tc "SELECT 1 FROM pg_roles WHERE rolname='osteodoc'" 2>nul | findstr "1" >nul 2>&1
if %errorlevel% neq 0 (
    psql -U postgres -h localhost -c "CREATE ROLE osteodoc WITH LOGIN PASSWORD '%DB_PASSWORD%';" >nul 2>&1
    echo   Datenbankbenutzer 'osteodoc' erstellt. [OK]
) else (
    psql -U postgres -h localhost -c "ALTER ROLE osteodoc WITH PASSWORD '%DB_PASSWORD%';" >nul 2>&1
    echo   Datenbankbenutzer 'osteodoc' existiert bereits (Passwort aktualisiert).
)

:: Datenbank erstellen
psql -U postgres -h localhost -tc "SELECT 1 FROM pg_database WHERE datname='osteodoc'" 2>nul | findstr "1" >nul 2>&1
if %errorlevel% neq 0 (
    psql -U postgres -h localhost -c "CREATE DATABASE osteodoc OWNER osteodoc;" >nul 2>&1
    echo   Datenbank 'osteodoc' erstellt. [OK]
) else (
    echo   Datenbank 'osteodoc' existiert bereits.
)

set "PGPASSWORD="

:: ─── Schritt 4: .env erstellen ───────────────────────────────
echo.
echo ──────────────────────────────────────────────────────
echo   [4/6] Konfiguration erstellen (.env)...
echo ──────────────────────────────────────────────────────

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
    echo   Bestehende .env wurde als .env.backup gesichert.
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
    echo DB_PASSWORD=%DB_PASSWORD%
    echo.
    echo # JWT-Authentifizierung
    echo JWT_SECRET=%JWT_SECRET%
    echo JWT_EXPIRES_IN=8h
    echo.
    echo # Admin-Ersteinrichtung
    echo ADMIN_USERNAME=admin
    echo ADMIN_PASSWORD=%ADMIN_PASSWORD%
) > .env

echo   .env erstellt. [OK]

:: ─── Schritt 5: npm-Pakete und Build ─────────────────────────
echo.
echo ──────────────────────────────────────────────────────
echo   [5/6] npm-Pakete installieren und Frontend bauen...
echo ──────────────────────────────────────────────────────

echo   Server-Abhaengigkeiten installieren...
call npm install --production
if %errorlevel% neq 0 (
    echo [FEHLER] npm install fehlgeschlagen!
    pause
    exit /b 1
)
echo   Server-Abhaengigkeiten [OK]

echo.
echo   Client-Abhaengigkeiten installieren...
cd client
call npm install
if %errorlevel% neq 0 (
    echo [FEHLER] npm install (Client) fehlgeschlagen!
    pause
    exit /b 1
)

echo   Frontend bauen (Webpack)...
call npx webpack --mode production
if %errorlevel% neq 0 (
    echo [FEHLER] Webpack-Build fehlgeschlagen!
    pause
    exit /b 1
)
cd /d "%SCRIPT_DIR%"
echo   Frontend-Build [OK]

:: ─── Schritt 6: Datenbank initialisieren ─────────────────────
echo.
echo ──────────────────────────────────────────────────────
echo   [6/6] Datenbank initialisieren...
echo ──────────────────────────────────────────────────────

node server/db/init.js
if %errorlevel% neq 0 (
    echo [FEHLER] Datenbank-Initialisierung fehlgeschlagen!
    pause
    exit /b 1
)
echo   Datenbank initialisiert. [OK]

:: ─── Start-Skript erstellen ──────────────────────────────────
(
    echo @echo off
    echo cd /d "%SCRIPT_DIR%"
    echo echo.
    echo echo   OsteoDoc Server wird gestartet...
    echo echo   URL: http://localhost:3000
    echo echo   Zum Beenden: Strg+C
    echo echo.
    echo node server/app.js
    echo pause
) > start-osteodoc.bat

echo.
echo   Startskript "start-osteodoc.bat" erstellt.

:: ─── Zusammenfassung ─────────────────────────────────────────
echo.
echo ======================================================
echo.
echo     OsteoDoc erfolgreich installiert!
echo.
echo ======================================================
echo.
echo   Server starten:
echo     Doppelklick auf "start-osteodoc.bat"
echo     oder: node server/app.js
echo.
echo   Server-URL:        http://localhost:3000
echo.
echo   Admin-Zugangsdaten:
echo     Benutzername:    admin
echo     Passwort:        %ADMIN_PASSWORD%
echo.
echo   WICHTIG: Passwort nach dem ersten Login aendern!
echo.
echo ======================================================
echo.

pause
