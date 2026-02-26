#!/bin/bash
# Schnellspeicherung: ./save.sh "Beschreibung der Änderung"
MSG="${1:-Änderungen gespeichert}"
cp /home/claude/ost-test.jsx ./osteoporose-fragebogen-v4.jsx
cp /mnt/user-data/outputs/osteoporose-risikocheck.html ./ 2>/dev/null || true
git add -A
git commit -m "$MSG"
echo "✓ Gespeichert: $MSG"
git log --oneline | head -5
