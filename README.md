# Webseite Elternberatung

Onepager mit Redaktions-Login. Inhalte liegen in `src/_data/seite.yml`, das Aussehen in `src/css/style.css`.

## Inhalte bearbeiten

1. `https://DEINE-DOMAIN/admin/` öffnen und mit GitHub anmelden.
2. «Inhalte» → «Webseite» öffnen, Texte und Bilder ändern, speichern.
3. Nach ein bis zwei Minuten ist die Änderung online.

Felder mit eckigen Klammern (`[...]`) sind Platzhalter. Das Angebot «Psychotherapie» ist vorbereitet und ausgeblendet; es wird über den Schalter «Auf der Seite anzeigen» sichtbar.

## Einmalige Einrichtung

1. **GitHub:** leeres, privates Repository anlegen und diesen Ordner hochladen (Branch `main`).
2. **Redaktions-Login:** in `src/admin/config.yml` bei `repo:` `BENUTZER/REPO-NAME` eintragen, bei `site_url:` die Domain.
3. **Infomaniak:** im Manager unter Webhosting → FTP/SSH einen FTP-Benutzer anlegen.
4. **GitHub → Settings → Secrets and variables → Actions**, drei Secrets anlegen:
   - `FTP_SERVER` (Hostname aus dem Infomaniak-Manager)
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
   Optional die Variable `FTP_ZIELORDNER` (z. B. `./sites/deine-domain.ch/`), falls der FTP-Benutzer nicht direkt im Ordner der Seite landet. Der Wert muss mit `/` enden.
5. Im Redaktions-Login unter «Einstellungen» die Domain eintragen.

Danach lädt jede Änderung die Seite automatisch neu hoch (Reiter «Actions» im Repository).

**Wichtig:** Das Hochladen gleicht den Zielordner mit der Seite ab. Die Terminbuchung kommt deshalb auf eine eigene Subdomain (z. B. `termin.deine-domain.ch`) mit eigenem Ordner, nicht in den Ordner der Webseite.

## Terminbuchung

Solange unter «Einstellungen → Adresse der Terminbuchung» nichts steht, zeigt die Seite einen Knopf «Termin per E-Mail anfragen» (sofern eine E-Mail eingetragen ist). Sobald das Buchungstool läuft, dort dessen Adresse eintragen; mit «Buchung direkt in der Seite anzeigen» wird es eingebettet.

## Lokal ansehen (optional)

```
npm install
npm start
```

## Sicherheit

- Die öffentliche Seite enthält kein JavaScript, keine Formulare und lädt nichts von fremden Servern.
- Das Redaktions-Login (`/admin`) läuft mit einer fest installierten Version von Sveltia CMS vom eigenen Server. Der Editor lädt beim Start zusätzlich Dateien (z. B. Schriften und Symbole) von den CDNs jsDelivr und unpkg und fragt den GitHub-Status ab; das betrifft nur dich im Login, nicht die Besucher.
- Für das Login ein **Fine-grained Token** verwenden: nur dieses eine Repository, nur «Contents: Read and write», mit Ablaufdatum.
- Für das Hochladen einen **eigenen FTP-Benutzer** anlegen, der nur den Ordner dieser Seite sieht.
- Die GitHub-Aktionen sind auf feste Commit-IDs fixiert. Aktualisierungen (auch `npm update`) bewusst und nicht automatisch einspielen.
