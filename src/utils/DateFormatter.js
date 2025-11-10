
function isDate(d) {
  return Object.prototype.toString.call(d) === '[object Date]';
}

function pad(n, len = 2) {
  return String(n).padStart(len, '0');
}

export function getDateString() {
  const d = new Date();
  const Y = d.getFullYear();
  const M = d.getMonth() + 1;
  const D = d.getDate();
  return `${D}${M}${Y}`;
}

export function formatDate(input, format = 'YYYY-MM-DD', options = {}) {
  const { utc = false } = options;
  const d = !isDate(input) ? parseDate(input) : input;
  if (!d) throw new TypeError('Invalid date input: ' + String(input));

  const Y = utc ? d.getUTCFullYear() : d.getFullYear();
  const M = (utc ? d.getUTCMonth() : d.getMonth()) + 1; // 1-12
  const D = utc ? d.getUTCDate() : d.getDate();

  switch (format) {
    case 'YYYY-MM-DD':
      return `${pad(Y, 4)}-${pad(M)}-${pad(D)}`;
    case 'MM/DD/YYYY':
      return `${pad(M)}/${pad(D)}/${pad(Y, 4)}`;
    case 'DD/MM/YYYY':
      return `${pad(D)}/${pad(M)}/${pad(Y, 4)}`;
    default:
      throw new TypeError(`Unsupported format: ${format}`);
  }
}


