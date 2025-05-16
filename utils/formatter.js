// === FORMATTER UTILITY ===

// SI mass units for idle scaling
const UNITS = [
  'ag', 'fg', 'pg', 'ng', 'μg', 'mg', 'g', 'kg',
  'Mg', 'Gg', 'Tg', 'Pg', 'Eg', 'Zg', 'Yg', 'Xg', 'Ng', 'Og', 'Qg'
];

// 1g = 1e18ag, so we start at attograms
const STEP = 1000;

function formatMass(mass) {
  let unitIndex = 0;
  while (mass >= STEP && unitIndex < UNITS.length - 1) {
    mass /= STEP;
    unitIndex++;
  }

  return `${mass.toFixed(2)} ${UNITS[unitIndex]}`;
}
