// === MASS FORMATTER ===

const UNITS = [
  'ag', 'fg', 'pg', 'ng', 'μg', 'mg', 'g',
  'kg', 'Mg', 'Gg', 'Tg', 'Pg', 'Eg', 'Zg', 'Yg'
];

function formatMass(mass) {
  let index = 0;
  while (mass >= 1000 && index < UNITS.length - 1) {
    mass /= 1000;
    index++;
  }
  return `${mass.toFixed(2)} ${UNITS[index]}`;
}
