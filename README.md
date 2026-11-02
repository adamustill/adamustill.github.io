# Adamus Systems – Download-Website

Eigenständige statische Website für GitHub Pages. Das bestehende Repository `adamustill/sfvp-update-test` wird nicht verändert.

## Einrichtung

1. Auf GitHub ein **öffentliches** Repository `adamustill.github.io` im Account `adamustill` erstellen (falls noch keines existiert).
2. Die Dateien `index.html`, `.nojekyll` und den Ordner `assets` **mit der gleichen Struktur** in die Wurzel des neuen Repositories hochladen.
3. Im neuen Repository unter **Settings → Pages → Build and deployment** `Deploy from a branch` wählen; `main` und `/(root)` einstellen und speichern.
4. Nach erfolgreichem Deployment `https://adamustill.github.io/` öffnen.

## Update-Logik

Die Website ruft im Browser die öffentliche GitHub-API unter
`https://api.github.com/repos/adamustill/sfvp-update-test/releases/latest` ab.

* Wenn genau eine `.exe` als Release-Asset gefunden wird, wird diese als Download angeboten.
* Wenn mehrere `.exe`-Dateien existieren und **genau eine** `portable` im Dateinamen enthält, wird diese angeboten.
* Wenn keine eindeutige EXE ermittelt werden kann oder die API nicht antwortet, führt die Schaltfläche zur Releases-Übersicht. Dadurch wird **niemals ein geratener Dateiname** verlinkt.
* Die API berücksichtigt das jeweils neueste veröffentlichte normale Release, **keine Drafts und keine Pre-Releases**.
* Dein vorhandener Auto-Update-Prozess wird nicht geändert.

## Datenschutz / Sicherheit

Die Website selbst enthält kein Login, keine Auftragsdaten und keinen geheimen API-Schlüssel. GitHub Releases und GitHub Pages sind öffentlich zugänglich. Späterer Mitarbeiterzugang benötigt eine separate, geeignete Authentifizierung und abgesicherte Datenbank sowie betriebliche Freigabe.

## Gestaltung

Die Seite verwendet das mitgelieferte Adamus-Systems-Logo und eine eigenständige Dark-Mode-Gestaltung. Sie ersetzt nicht die bestehende SFVP-Landingpage.
