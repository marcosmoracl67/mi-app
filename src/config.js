// src/config.js
const raw = (process.env.REACT_APP_API_BASE_URL || '').trim();
const noInlineComment = raw.split('#')[0].trim(); // evita “# …” al final
export const API_BASE_URL = noInlineComment.replace(/\/+$/, ''); // sin slash final