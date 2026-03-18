@echo off
:: ============================================================
:: OsteoDoc – Node.js & PostgreSQL Installer fuer Windows
::
:: Laedt Node.js 20 LTS und PostgreSQL 16 automatisch herunter
:: und installiert beide Komponenten.
::
:: Verwendung:
::   Rechtsklick > "Als Administrator ausfuehren"
::
:: Nach der Installation:
::   install-windows.bat ausfuehren fuer die OsteoDoc-Einrichtung
:: ============================================================

echo.
echo ======================================================
echo.
echo   OsteoDoc - Node.js ^& PostgreSQL Installer
echo   Laedt und installiert alle Voraussetzungen
echo.
echo ======================================================
echo.

:: Administratorrechte pruefen
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [FEHLER] Bitte als Administrator ausfuehren!
    echo          Rechtsklick auf die Datei ^> "Als Administrator ausfuehren"
    echo.
    pause
    exit /b 1
)

:: PowerShell-Skript ausfuehren
echo   Starte Installations-Skript...
echo.

powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0install-prerequisites-windows.ps1"

if %errorlevel% neq 0 (
    echo.
    echo [FEHLER] Installation fehlgeschlagen.
    echo.
    pause
    exit /b 1
)

echo.
pause
