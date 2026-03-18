#!/bin/bash
# ============================================================
# OsteoDoc – Installationsskript für Linux (Ubuntu/Debian)
#
# Verwendung:
#   chmod +x install-linux.sh
#   sudo bash install-linux.sh
#
# Dieses Skript installiert alle Abhängigkeiten, richtet
# PostgreSQL ein, baut das Frontend und startet den Server.
# ============================================================

set -e

# Farben für Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Keine Farbe

print_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_warning() {
    echo -e "${YELLOW}  WARNUNG: $1${NC}"
}

print_error() {
    echo -e "${RED}  FEHLER: $1${NC}"
}

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║     OsteoDoc – Server-Installation (Linux)       ║${NC}"
echo -e "${GREEN}║     Osteoporose-Bewertung nach DVO 2023          ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# ─── Voraussetzungen prüfen ──────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    print_error "Bitte als root ausführen:"
    echo "   sudo bash install-linux.sh"
    exit 1
fi

# Betriebssystem prüfen
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo -e "  Betriebssystem: ${GREEN}${PRETTY_NAME}${NC}"
else
    print_warning "Betriebssystem konnte nicht erkannt werden."
fi

# Installationsverzeichnis (dort wo das Skript liegt)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="/opt/osteodoc"

echo "  Quellverzeichnis: ${SCRIPT_DIR}"
echo "  Zielverzeichnis:  ${APP_DIR}"

# ─── Schritt 1: Systemabhängigkeiten ─────────────────────────
print_step "[1/8] Systemabhängigkeiten installieren..."

apt-get update -qq

# Basispakete
apt-get install -y -qq \
    curl \
    build-essential \
    openssl \
    2>/dev/null

echo "  Basispakete installiert."

# ─── Schritt 2: Node.js installieren ─────────────────────────
print_step "[2/8] Node.js prüfen / installieren..."

NEED_NODE=false
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_warning "Node.js Version $(node --version) ist zu alt (mind. v18 erforderlich)."
        NEED_NODE=true
    else
        echo -e "  Node.js $(node --version) ist bereits installiert. ${GREEN}OK${NC}"
    fi
else
    NEED_NODE=true
fi

if [ "$NEED_NODE" = true ]; then
    echo "  Installiere Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>/dev/null
    apt-get install -y -qq nodejs
    echo -e "  Node.js $(node --version) installiert. ${GREEN}OK${NC}"
fi

echo "  npm Version: $(npm --version)"

# ─── Schritt 3: PostgreSQL installieren ──────────────────────
print_step "[3/8] PostgreSQL installieren / prüfen..."

if ! command -v psql &> /dev/null; then
    apt-get install -y -qq postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
    echo -e "  PostgreSQL installiert und gestartet. ${GREEN}OK${NC}"
else
    echo -e "  PostgreSQL ist bereits installiert. ${GREEN}OK${NC}"
    # Sicherstellen, dass PostgreSQL läuft
    systemctl is-active --quiet postgresql || systemctl start postgresql
fi

# ─── Schritt 4: Datenbank einrichten ─────────────────────────
print_step "[4/8] Datenbank einrichten..."

# Sicheres Passwort generieren
DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)

# Benutzer erstellen (falls nicht vorhanden)
if sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='osteodoc'" | grep -q 1; then
    echo "  Datenbankbenutzer 'osteodoc' existiert bereits."
    # Passwort aktualisieren
    sudo -u postgres psql -c "ALTER ROLE osteodoc WITH PASSWORD '${DB_PASSWORD}';" > /dev/null 2>&1
else
    sudo -u postgres psql -c "CREATE ROLE osteodoc WITH LOGIN PASSWORD '${DB_PASSWORD}';" > /dev/null 2>&1
    echo -e "  Datenbankbenutzer 'osteodoc' erstellt. ${GREEN}OK${NC}"
fi

# Datenbank erstellen (falls nicht vorhanden)
if sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='osteodoc'" | grep -q 1; then
    echo "  Datenbank 'osteodoc' existiert bereits."
else
    sudo -u postgres psql -c "CREATE DATABASE osteodoc OWNER osteodoc;" > /dev/null 2>&1
    echo -e "  Datenbank 'osteodoc' erstellt. ${GREEN}OK${NC}"
fi

# ─── Schritt 5: Anwendung installieren ───────────────────────
print_step "[5/8] Anwendungsdateien kopieren..."

mkdir -p "${APP_DIR}/logs"

if [ "${SCRIPT_DIR}" != "${APP_DIR}" ]; then
    cp -r "${SCRIPT_DIR}/." "${APP_DIR}/"
    echo "  Dateien nach ${APP_DIR} kopiert."
else
    echo "  Anwendung befindet sich bereits in ${APP_DIR}."
fi

cd "${APP_DIR}"

# ─── Schritt 6: .env erstellen ───────────────────────────────
print_step "[6/8] Konfiguration erstellen (.env)..."

JWT_SECRET=$(openssl rand -base64 48 | tr -d '/+=' | head -c 64)
ADMIN_PASSWORD=$(openssl rand -base64 12 | tr -d '/+=' | head -c 16)

if [ -f .env ]; then
    cp .env ".env.backup.$(date +%Y%m%d_%H%M%S)"
    print_warning "Bestehende .env wurde gesichert."
fi

cat > .env << EOF
# OsteoDoc Konfiguration (automatisch generiert am $(date '+%d.%m.%Y %H:%M'))
PORT=3000
NODE_ENV=production

# Datenbank (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=osteodoc
DB_USER=osteodoc
DB_PASSWORD=${DB_PASSWORD}

# JWT-Authentifizierung
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=8h

# Admin-Ersteinrichtung
ADMIN_USERNAME=admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF

chmod 600 .env
echo -e "  .env erstellt und geschützt (chmod 600). ${GREEN}OK${NC}"

# ─── Schritt 7: npm-Pakete und Build ─────────────────────────
print_step "[7/8] npm-Pakete installieren und Frontend bauen..."

echo "  Server-Abhängigkeiten installieren..."
npm install --production 2>&1 | tail -1

echo "  Client-Abhängigkeiten installieren..."
cd client
npm install 2>&1 | tail -1

echo "  Frontend bauen (Webpack)..."
npx webpack --mode production 2>&1 | tail -3
cd "${APP_DIR}"

echo "  Datenbank initialisieren..."
node server/db/init.js

echo -e "  Build abgeschlossen. ${GREEN}OK${NC}"

# ─── Schritt 8: Systemd-Service einrichten ────────────────────
print_step "[8/8] Systemd-Service einrichten..."

# Benutzer für den Service
useradd --system --no-create-home --shell /bin/false osteodoc 2>/dev/null || true
chown -R osteodoc:osteodoc "${APP_DIR}"

cat > /etc/systemd/system/osteodoc.service << EOF
[Unit]
Description=OsteoDoc - Osteoporose-Bewertungsserver
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=osteodoc
Group=osteodoc
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/node server/app.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable osteodoc
systemctl start osteodoc

echo -e "  Service 'osteodoc' erstellt und gestartet. ${GREEN}OK${NC}"

# ─── Zusammenfassung ──────────────────────────────────────────
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║   OsteoDoc erfolgreich installiert!              ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Server-URL:${NC}        http://localhost:3000"
echo ""
echo -e "  ${BLUE}Admin-Zugangsdaten:${NC}"
echo -e "    Benutzername:    ${GREEN}admin${NC}"
echo -e "    Passwort:        ${GREEN}${ADMIN_PASSWORD}${NC}"
echo ""
echo -e "  ${YELLOW}WICHTIG: Passwort nach dem ersten Login aendern!${NC}"
echo ""
echo -e "  ${BLUE}Nuetzliche Befehle:${NC}"
echo "    Status pruefen:   systemctl status osteodoc"
echo "    Logs anzeigen:    journalctl -u osteodoc -f"
echo "    Neustart:         systemctl restart osteodoc"
echo "    Stoppen:          systemctl stop osteodoc"
echo ""
echo -e "  ${BLUE}Optionale naechste Schritte:${NC}"
echo "    1. Nginx als Reverse-Proxy einrichten (siehe nginx/osteodoc.conf)"
echo "    2. SSL-Zertifikat mit Let's Encrypt:"
echo "       apt install certbot python3-certbot-nginx"
echo "       certbot --nginx -d ihre-domain.de"
echo ""
