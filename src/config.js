// src/config.js
const raw = (process.env.REACT_APP_API_BASE_URL || '').trim();
const noInlineComment = raw.split('#')[0].trim(); // evita “# …” al final
const sanitized = noInlineComment.replace(/\/+$/, ''); // sin slash final

export const API_BASE_URL = /localhost/i.test(sanitized) ? '' : sanitized;