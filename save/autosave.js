// === AUTOSAVE SYSTEM ===

const SAVE_KEY = 'collidle-save';
const AUTOSAVE_INTERVAL = 15000; // 15 seconds

// Auto-save every interval
setInterval(() => {
  saveGame();
}, AUTOSAVE_INTERVAL);

// Save on page unload
window.addEventListener('beforeunload', () => {
  saveGame();
  localStorage.setItem('collidle-last-saved', Date.now());
});

// Offline progress logic
function handleOfflineProgress() {
  const last = Number(localStorage.getItem('collidle-last-saved'));
  if (!last) return;

  const now = Date.now();
  const deltaSeconds = Math.floor((now - last) / 1000);
  if (deltaSeconds < 1) return;

  const passiveRate = 1; // ag per second (base)
  const offlineMass = deltaSeconds * passiveRate;
  gameState.mass += offlineMass;

  console.log(`Offline for ${deltaSeconds}s. Awarded ${offlineMass} ag.`);
}
