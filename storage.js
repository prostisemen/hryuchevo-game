const KEY = 'hrj_save_v1';

export function loadSave() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? null; }
  catch { return null; }
}
export function saveSave(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
export function newSave() {
  return {
    createdAt: Date.now(),
    coins: 50, grain: 0,
    hp: 100, energy: 100, satiety: 70,
    age: 18, cropPlantedAt: 0, dead: false, _lastAgeUp: Date.now()
  };
}
export function exportJSON() {
  const data = localStorage.getItem(KEY);
  const blob = new Blob([data ?? JSON.stringify(newSave())], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'hrj_save.json';
  a.click();
}
export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      try { const data = JSON.parse(r.result); saveSave(data); resolve(data); }
      catch(e){ reject(e); }
    };
    r.onerror = reject;
    r.readAsText(file);
  });
}