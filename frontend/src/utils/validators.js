export function isRequired(value) {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  return true;
}

export function isEmail(value) {
  if (typeof value !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function isPhoneVN(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const phoneRegex1 = /^0\d{9}$/;
  const phoneRegex2 = /^\+84\d{9,10}$/;

  return phoneRegex1.test(value) || phoneRegex2.test(value);
}

export function isNonNegativeNumber(value) {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return !isNaN(num) && isFinite(num) && num >= 0;
}

export function minLength(value, n) {
  if (value === null || value === undefined) {
    return false;
  }
  const str = typeof value === 'string' ? value : String(value);
  return str.length >= n;
}

export function validateObject(payload, rules) {
  const errors = {};
  let isValid = true;

  for (const fieldName in rules) {
    const validators = rules[fieldName];
    const value = payload[fieldName];

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
        break;
      }
    }
  }

  return { isValid, errors };
}

export function requiredMsg(msg) {
  return (value) => {
    return isRequired(value) ? null : msg;
  };
}

export function nonNegativeMsg(msg) {
  return (value) => {
    return isNonNegativeNumber(value) ? null : msg;
  };
}

export function emailMsg(msg) {
  return (value) => {
    return isEmail(value) ? null : msg;
  };
}
