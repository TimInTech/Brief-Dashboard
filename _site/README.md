# 📬 Brief-Dashboard PRO

![Screenshot](screenshot.png)

**Lokale Verwaltung Ihrer Post mit Dokumentenarchiv**  
*Entwickelt von [TimInTech](https://github.com/TimInTech)*

---

## ✨ Funktionen

✅ **Vollständig offline** – Alle Daten bleiben in Ihrem Browser  
✅ **Flexible Erfassung** – Keine Pflichtfelder (außer Datum)  
✅ **Dokumentenarchiv** – Nur PDFs und Bilder (JPG/PNG) direkt anhängen (bis 5 MB)  
✅ **Live-Statistiken** – Übersicht nach Kategorien und Beträgen  
✅ **Einfacher Export** – ZIP mit allen Daten + Dokumenten  
✅ **Responsive Design** – Optimiert für Desktop & Mobile  

---

## 📥 Installation

1. Lade die Datei [`index.html`](../blob/main/index.html) herunter  
2. Öffne sie per Doppelklick im Browser (Chrome oder Firefox empfohlen)  
3. Beginne sofort mit der Eingabe und verwalte deine Briefe direkt im Browser  

Alternativ via Git:

```bash
git clone https://github.com/TimInTech/Brief-Dashboard.git
````

---

## 🖥️ Nutzung

### 1. Brief erfassen:

* Datum (automatisch vorausgefüllt)
* Optionale Felder: Absender, Betreff, Betrag, Frist
* Dokumente anhängen (nur PDF, JPG, PNG – max. 5 Dateien)

### 2. Verwalten:

* Filter nach Kategorie oder Status
* Status ändern: 📭 „offen“ → 📖 „in Bearbeitung“ → ✅ „erledigt“
* Anhänge anzeigen oder entfernen

### 3. Exportieren:

* Komplettes ZIP-Archiv mit Einträgen und Anhängen
* Optionale Einzel-Export-Funktion je Brief
* Automatische Sicherung über `localStorage`

---

## 📊 Beispiel-Statistik

```
Briefe nach Kategorie:
🟥 Gericht / Inkasso: 2
🟧 Versorger / Banken: 5  
🟨 Behörde / Krankenkasse: 3
🟩 Werbung / Privat: 10
🏫 Schule / Beratung: 1

Briefe nach Status:
🔴 offen: 7  
🟡 in Bearbeitung: 3  
🟢 erledigt: 11  

Summe offener Beträge: 127,89 €
```

---

## 💻 Technologie

* **Frontend**: HTML5, CSS3, JavaScript
* **UI-Framework**: [Tailwind CSS (eingebettet)](https://tailwindcss.com/)
* **Export & Archivierung**: [JSZip](https://stuk.github.io/jszip/), [FileSaver.js](https://github.com/eligrey/FileSaver.js)
* **Kompatibilität**: Chrome, Firefox, Edge, Safari – vollständig offline nutzbar

---

## 📜 Lizenz

Veröffentlicht unter der [MIT License](LICENSE) – Open Source, privat und gewerblich frei nutzbar.

---

