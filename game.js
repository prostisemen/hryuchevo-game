import { loadSave, saveSave, newSave, exportJSON, importJSON } from './storage.js';

const GROW_MS = 60 * 60 * 1000; // 1 час
let S = loadSave() || newSave(); saveSave(S);

const $ = s => document.querySelector(s);
const st = $('#status');

function now(){ return Date.now(); }
function growthStatus(){
  if (!S.cropPlantedAt) return 'Поле: ничего не посажено';
  const left = S.cropPlantedAt + GROW_MS - now();
  return left <= 0 ? 'Поле: пшеница созрела ✅' : `Поле: растёт… ~${Math.ceil(left/60000)} мин`;
}
function decay(){
  S.satiety = Math.max(0, S.satiety - 2);
  if (S.satiety === 0) S.hp = Math.max(0, S.hp - 5);
  if (S.hp === 0) S.dead = true;
}
function render(){
  st.innerHTML = `
    Возраст: <b>${S.age}</b><br>
    HP: <b>${S.hp}/100</b> • Сытость: <b>${S.satiety}/100</b> • Энергия: <b>${S.energy}/100</b><br>
    Монеты: <b>${S.coins}</b> • Зерно: <b>${S.grain}</b><br>
    ${growthStatus()}<br>
    Статус: ${S.dead ? '☠️ Мёртв' : '🟢 Жив'}
  `;
}
function tick(){ render(); saveSave(S); }

// Кнопки
$('#plant').onclick = () => {
  if (S.cropPlantedAt) return alert('Уже растёт');
  S.cropPlantedAt = now(); tick();
};
$('#harvest').onclick = () => {
  if (!S.cropPlantedAt || now() < S.cropPlantedAt + GROW_MS) return alert('Ещё не созрела');
  S.cropPlantedAt = 0; S.grain += 3; tick();
};
$('#feed').onclick = () => {
  if (S.dead) return alert('Мёртвые не едят');
  if (S.grain <= 0) return alert('Нет зерна');
  S.grain--; S.satiety = Math.min(100, S.satiety + 25); tick();
};
$('#work').onclick = () => {
  if (S.dead) return alert('Ты мёртв');
  if (S.energy < 20) return alert('Мало энергии');
  S.energy -= 20; S.coins += 15; decay(); tick();
};
$('#sleep').onclick = () => { S.energy = Math.min(100, S.energy + 50); tick(); };
$('#revive').onclick = () => {
  if (!S.dead) return alert('Ты и так жив');
  if (S.coins < 100) return alert('Нужно 100 монет');
  S.coins -= 100; S.dead = false; S.hp = S.satiety = S.energy = 50;
  S.grain = Math.max(0, (S.grain|0)*0.7|0); tick();
};
$('#export').onclick = exportJSON;
$('#import').onchange = async e => {
  try { S = await importJSON(e.target.files[0]); render(); alert('Импортирован'); }
  catch { alert('Неверный файл'); }
};

// Возраст +1 раз в 24 часа
setInterval(() => {
  const last = +(S._lastAgeUp || 0);
  if (now() - last > 24*60*60*1000) { S.age++; S._lastAgeUp = now(); tick(); }
}, 10_000);

// Периодический тик
setInterval(() => { decay(); tick(); }, 60_000);

render();