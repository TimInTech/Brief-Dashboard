// Globale Variablen
const form = document.getElementById("briefForm");
const tableBody = document.querySelector("#briefTable tbody");
let eintraege = JSON.parse(localStorage.getItem("briefEintraege")) || [];

// Initialisierung
window.addEventListener("load", () => {
  loadData();
  setCurrentDate();
  loadDraft();
  setupAutoSave();
});

// Daten laden
function loadData() {
  const savedData = localStorage.getItem("briefEintraege");
  if (savedData) eintraege = JSON.parse(savedData);
  renderTabelle();
  updateStatistik();
}

// Aktuelles Datum setzen
function setCurrentDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datum').value = today;
}

// Entwurf laden
function loadDraft() {
  const draft = JSON.parse(localStorage.getItem("briefDraft"));
  if (draft) {
    if (draft.datum) document.getElementById('datum').value = draft.datum;
    if (draft.absender) document.getElementById('absender').value = draft.absender;
    if (draft.betreff) document.getElementById('betreff').value = draft.betreff;
    if (draft.betrag) document.getElementById('betrag').value = draft.betrag;
    if (draft.frist) document.getElementById('frist').value = draft.frist;
    if (draft.kategorie) document.getElementById('kategorie').value = draft.kategorie;
    if (draft.status) document.getElementById('status').value = draft.status;
    if (draft.notizen) document.getElementById('notizen').value = draft.notizen;
  }
}

// Auto-Save einrichten
function setupAutoSave() {
  form.addEventListener("input", () => {
    const tempData = {
      datum: form.datum.value,
      absender: form.absender.value,
      betreff: form.betreff.value,
      betrag: form.betrag.value,
      frist: form.frist.value,
      kategorie: form.kategorie.value,
      status: form.status.value,
      notizen: form.notizen.value
    };
    localStorage.setItem("briefDraft", JSON.stringify(tempData));
  });
}

// Formularverarbeitung
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Dokumente verarbeiten
  const files = document.getElementById('dokumente').files;
  let dokumenteData = [];
  
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`Datei ${file.name} ist zu groß (max. 5MB)`);
        continue;
      }
      
      const dataUrl = await readFileAsDataURL(file);
      dokumenteData.push({
        name: file.name,
        type: file.type,
        size: file.size,
        data: dataUrl
      });
    }
  }
  
  const neuerEintrag = {
    id: Date.now(),
    datum: form.datum.value || new Date().toISOString().split('T')[0],
    absender: form.absender.value || null,
    betreff: form.betreff.value || null,
    betrag: form.betrag.value || null,
    frist: form.frist.value || null,
    kategorie: form.kategorie.value || "🟩 Werbung / Privat",
    status: form.status.value || "📭 Ungeöffnet",
    notizen: form.notizen.value || null,
    dokumente: dokumenteData,
    erstelltAm: new Date().toISOString()
  };
  
  eintraege.push(neuerEintrag);
  saveAndRender();
  form.reset();
  setCurrentDate();
  localStorage.removeItem("briefDraft");
  alert("Eintrag erfolgreich gespeichert!");
});

// Datei als DataURL lesen
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Speichern und Anzeigen
function saveAndRender() {
  localStorage.setItem("briefEintraege", JSON.stringify(eintraege));
  renderTabelle();
  updateStatistik();
}

// Tabelle rendern
function renderTabelle() {
  const kategorieFilter = document.getElementById('filterKategorie').value;
  const statusFilter = document.getElementById('filterStatus').value;
  
  tableBody.innerHTML = "";
  
  // Sortiere nach Datum (neueste zuerst)
  const sortedEintraege = [...eintraege].sort((a, b) => new Date(b.datum) - new Date(a.datum));
  
  sortedEintraege.forEach((eintrag, index) => {
    if (kategorieFilter && eintrag.kategorie !== kategorieFilter) return;
    if (statusFilter && eintrag.status !== statusFilter) return;
    
    const row = document.createElement("tr");
    row.className = getPriorityClass(eintrag.kategorie);
    
    // Dokumenten-Icons
    let docIcons = '';
    if (eintrag.dokumente && eintrag.dokumente.length > 0) {
      const docCount = eintrag.dokumente.length;
      docIcons = `
        <div class="flex items-center">
          <span class="mr-1">${docCount}</span>
          ${eintrag.dokumente.some(d => d.type === 'application/pdf') ? '📄' : ''}
          ${eintrag.dokumente.some(d => d.type.startsWith('image/')) ? '🖼️' : ''}
        </div>
      `;
    }
    
    row.innerHTML = `
      <td class="p-2 border">${formatDate(eintrag.datum)}</td>
      <td class="p-2 border">${eintrag.absender || '-'}</td>
      <td class="p-2 border">${eintrag.betreff || '-'}</td>
      <td class="p-2 border text-right">${eintrag.betrag ? parseFloat(eintrag.betrag).toFixed(2) + " €" : "-"}</td>
      <td class="p-2 border">${eintrag.kategorie}</td>
      <td class="p-2 border">${eintrag.status}</td>
      <td class="p-2 border">
        <div class="flex gap-1">
          <button onclick="viewEntry(${index})" class="text-xs bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded">
            Ansehen
          </button>
          <button onclick="deleteEntry(${index})" class="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded">
            Löschen
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Statistik aktualisieren
function updateStatistik() {
  let catRed = 0, catOrange = 0, catYellow = 0, catGreen = 0, catSchool = 0;
  let statusOpen = 0, statusBearbeitung = 0, statusErledigt = 0;
  let summe = 0;

  eintraege.forEach(e => {
    // Kategorien zählen
    if (e.kategorie.includes('🟥')) catRed++;
    if (e.kategorie.includes('🟧')) catOrange++;
    if (e.kategorie.includes('🟨')) catYellow++;
    if (e.kategorie.includes('🟩')) catGreen++;
    if (e.kategorie.includes('🏫')) catSchool++;

    // Status zählen
    if (e.status.includes('📭') || e.status.includes('🔴')) statusOpen++;
    if (e.status.includes('📖') || e.status.includes('📝') || e.status.includes('🟡')) statusBearbeitung++;
    if (e.status.includes('✅') || e.status.includes('🟢')) statusErledigt++;

    // Summe offener Beträge
    if ((e.status.includes('📭') || e.status.includes('🔴') || e.status.includes('📖') || e.status.includes('📝') || e.status.includes('🟡')) && e.betrag) {
      const betrag = parseFloat(e.betrag);
      if (!isNaN(betrag)) summe += betrag;
    }
  });

  // Statistik aktualisieren
  document.getElementById('catRed').textContent = catRed;
  document.getElementById('catOrange').textContent = catOrange;
  document.getElementById('catYellow').textContent = catYellow;
  document.getElementById('catGreen').textContent = catGreen;
  document.getElementById('catSchool').textContent = catSchool;

  document.getElementById('statusOpen').textContent = statusOpen;
  document.getElementById('statusBearbeitung').textContent = statusBearbeitung;
  document.getElementById('statusErledigt').textContent = statusErledigt;
  document.getElementById('summeOffen').textContent = summe.toFixed(2);
}

// Eintrag anzeigen
function viewEntry(index) {
  const eintrag = eintraege[index];
  let message = `Details:\nDatum: ${formatDate(eintrag.datum)}\nAbsender: ${eintrag.absender || '-'}\nBetreff: ${eintrag.betreff || '-'}\nBetrag: ${eintrag.betrag || '-'}\nStatus: ${eintrag.status}`;
  
  if (eintrag.notizen) {
    message += `\nNotizen: ${eintrag.notizen}`;
  }
  
  if (eintrag.dokumente && eintrag.dokumente.length > 0) {
    message += `\n\nAnhänge (${eintrag.dokumente.length}):`;
    eintrag.dokumente.forEach(doc => {
      message += `\n- ${doc.name} (${(doc.size / 1024).toFixed(1)} KB)`;
    });
  }
  
  alert(message);
}

// Eintrag löschen
function deleteEntry(index) {
  if (confirm("Diesen Eintrag wirklich löschen?")) {
    eintraege.splice(index, 1);
    saveAndRender();
  }
}

// Export als ZIP
function exportAllAsZip() {
  const zip = new JSZip();
  const dataFolder = zip.folder("briefdaten");
  
  // JSON mit allen Einträgen
  dataFolder.file("briefe.json", JSON.stringify(eintraege, null, 2));
  
  // Dokumente hinzufügen
  eintraege.forEach((eintrag, i) => {
    if (eintrag.dokumente && eintrag.dokumente.length > 0) {
      const entryFolder = dataFolder.folder(`eintrag_${i}`);
      eintrag.dokumente.forEach((doc, j) => {
        const base64Data = doc.data.split(',')[1];
        entryFolder.file(doc.name, base64Data, { base64: true });
      });
    }
  });
  
  // ZIP erstellen und herunterladen
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, `briefe_export_${new Date().toISOString().split('T')[0]}.zip`);
    alert("Export erfolgreich erstellt!");
  });
}

// Hilfsfunktionen
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
}

function getPriorityClass(kategorie) {
  if (kategorie.includes('🟥')) return 'priority-high';
  if (kategorie.includes('🟧')) return 'priority-medium';
  if (kategorie.includes('🟨')) return 'priority-medium';
  return 'priority-low';
}
