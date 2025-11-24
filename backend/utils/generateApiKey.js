import crypto from 'crypto';

/**
 * Generates a cryptographically secure API key
 * Format: ak_{prefix}_{32-char-base64}
 * @param {string} prefix - 'live' or 'test'
 * @returns {string} Generated API key
 */
export const generateApiKey = (prefix = 'live') => {
  // Generate 32 random bytes (256 bits)
  const randomBytes = crypto.randomBytes(32);
  // Convert to base64 and remove padding
  const base64Key = randomBytes.toString('base64').replace(/[+/=]/g, (char) => {
    // Replace URL-unsafe characters with URL-safe alternatives
    if (char === '+') return '-';
    if (char === '/') return '_';
    if (char === '=') return '';
    return char;
  });

  // Take first 32 characters for consistent length
  const keyPart = base64Key.substring(0, 32);

  return `ak_${prefix}_${keyPart}`;
};

