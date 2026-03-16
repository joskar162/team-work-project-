import DOMPurify from 'dompurify';

export function sanitizeText(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

export function sanitizePayload(payload) {
  const sanitized = {};

  Object.entries(payload).forEach(([key, value]) => {
    sanitized[key] = typeof value === 'string' ? sanitizeText(value) : value;
  });

  return sanitized;
}
