#!/bin/bash
# ============================================================
# OsteoDoc – Installations-Skript
# Richtet die Serveranwendung auf einem Ubuntu/Debian-System ein
# ============================================================

set -e

echo "======================================"
echo " OsteoDoc – Server-Installation"
echo "======================================"

# Prüfe Root-Rechte
if [ "$EUID" -ne 0 ]; then
  echo "Bitte als root ausführen: sudo bash setup.sh"
  exit 1
fi

# ─── 1. Systemabhängigkeiten ────────────────────────────────
echo ""
echo "[1/7] Installiere Systemabhängigkeiten..."
apt-get update -qq
apt-get install -y -qq nginx postgresql postgresql-contrib certbot python3-certbot-nginx ufw curl

# Node.js 20 LTS (falls nicht vorhanden)
if ! command -v node &> /dev/null; then
  echo "Installiere Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi

echo "Node.js Version: $(node --version)"
echo "npm Version: $(npm --version)"

# ─── 2. PostgreSQL einrichten ────────────────────────────────
echo ""
echo "[2/7] Richte PostgreSQL ein..."

# Generiere sicheres Passwort
DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)

sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='osteodoc'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE ROLE osteodoc WITH LOGIN PASSWORD '${DB_PASSWORD}';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='osteodoc'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE osteodoc OWNER osteodoc;"

echo "Datenbank 'osteodoc' eingerichtet."

# ─── 3. Anwendung installieren ──────────────────────────────
echo ""
echo "[3/7] Installiere OsteoDoc-Anwendung..."

APP_DIR="/opt/osteodoc"
mkdir -p ${APP_DIR}/logs

# Dateien kopieren (wenn nicht bereits am richtigen Ort)
if [ "$(pwd)" != "${APP_DIR}" ]; then
  cp -r . ${APP_DIR}/
fi

cd ${APP_DIR}

# .env erstellen
JWT_SECRET=$(openssl rand -base64 48 | tr -d '/+=' | head -c 64)
ADMIN_PASSWORD=$(openssl rand -base64 12 | tr -d '/+=' | head -c 16)

cat > .env << EOF
# OsteoDoc Konfiguration (automatisch generiert)
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=5432
DB_NAME=osteodoc
DB_USER=osteodoc
DB_PASSWORD=${DB_PASSWORD}

JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=8h

ADMIN_USERNAME=admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}
EOF

echo ".env erstellt."

# ─── 4. npm-Pakete installieren ──────────────────────────────
echo ""
echo "[4/7] Installiere npm-Pakete (offline-kompatibel)..."
npm install --production
cd client && npm install && npx webpack --mode production && cd ..

# ─── 5. Datenbank initialisieren ────────────────────────────
echo ""
echo "[5/7] Initialisiere Datenbank..."
node server/db/init.js

# ─── 6. Firewall konfigurieren ──────────────────────────────
echo ""
echo "[6/7] Konfiguriere Firewall (ufw)..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (für Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw --force enable
echo "Firewall aktiviert: SSH, HTTP, HTTPS erlaubt."

# ─── 7. Nginx konfigurieren ─────────────────────────────────
echo ""
echo "[7/7] Konfiguriere Nginx..."
cp nginx/osteodoc.conf /etc/nginx/sites-available/osteodoc
ln -sf /etc/nginx/sites-available/osteodoc /etc/nginx/sites-enabled/osteodoc
rm -f /etc/nginx/sites-enabled/default

# Nginx-Konfiguration testen
nginx -t

# ─── Systemd-Service erstellen ──────────────────────────────
cat > /etc/systemd/system/osteodoc.service << EOF
[Unit]
Description=OsteoDoc Server
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/node server/app.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable osteodoc
systemctl start osteodoc
systemctl restart nginx

echo ""
echo "======================================"
echo " OsteoDoc erfolgreich installiert!"
echo "======================================"
echo ""
echo " Admin-Zugangsdaten:"
echo "   Benutzername: admin"
echo "   Passwort:     ${ADMIN_PASSWORD}"
echo ""
echo " WICHTIG: Passwort nach dem ersten Login ändern!"
echo ""
echo " Nächste Schritte:"
echo "   1. Domain in nginx/osteodoc.conf anpassen"
echo "   2. SSL-Zertifikat einrichten:"
echo "      certbot --nginx -d osteodoc.example.com"
echo "   3. Nginx neu starten: systemctl restart nginx"
echo ""
echo " Status prüfen:"
echo "   systemctl status osteodoc"
echo "   journalctl -u osteodoc -f"
echo ""
