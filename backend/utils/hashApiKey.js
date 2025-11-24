import bcrypt from 'bcryptjs';

/**
 * Hash an API key using bcrypt
 * @param {string} apiKey - The raw API key to hash
 * @returns {Promise<string>} Hashed API key
 */
export const hashApiKey = async (apiKey) => {
  return await bcrypt.hash(apiKey, 10);
};

/**
 * Compare a raw API key with a hashed key
 * @param {string} rawKey - The raw API key
 * @param {string} hashedKey - The stored hashed key
 * @returns {Promise<boolean>} True if keys match
 */
export const compareApiKey = async (rawKey, hashedKey) => {
  return await bcrypt.compare(rawKey, hashedKey);
};

