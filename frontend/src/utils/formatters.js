export function formatCurrencyVND(value) {
  if (value === null || value === undefined) {
    return '0';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num) || !isFinite(num)) {
    return '0';
  }

  const fixed = Math.floor(Math.abs(num)).toString();
  return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined) {
    return '0';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num) || !isFinite(num)) {
    return '0';
  }

  const formatted = num.toFixed(decimals);
  
  if (decimals > 0) {
    return formatted.replace(/\.?0+$/, '');
  }

  return formatted;
}

export function formatDateISO(date) {
  if (!date) {
    return '';
  }

  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return '';
  }

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTime(date) {
  if (!date) {
    return '';
  }

  let dateObj;
  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    return '';
  }

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function safeParseJSON(str, fallback = null) {
  if (typeof str !== 'string') {
    return fallback;
  }

  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
