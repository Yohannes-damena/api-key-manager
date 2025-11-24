import ApiKey from '../models/ApiKey.js';
import Project from '../models/Project.js';
import UsageLog from '../models/UsageLog.js';
import { compareApiKey } from '../utils/hashApiKey.js';

/**
 * Middleware to validate API key from x-api-key header
 * Attaches project and user to req object
 */
export const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }

    // Find all active API keys (we'll compare hashes)
    const activeKeys = await ApiKey.find({ status: 'active' }).populate('projectId');

    // Try to match the incoming key with stored hashes
    let matchedKey = null;
    for (const key of activeKeys) {
      const isMatch = await compareApiKey(apiKey, key.hashedKey);
      if (isMatch) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Update last used timestamp
    matchedKey.lastUsedAt = new Date();
    await matchedKey.save();

    // Get project details
    const project = await Project.findById(matchedKey.projectId).populate('owner');

    // Log usage
    await UsageLog.create({
      keyId: matchedKey._id,
      endpoint: req.path,
      ip: req.ip || req.connection.remoteAddress,
      method: req.method,
    });

    // Attach to request
    req.apiKey = matchedKey;
    req.project = project;
    req.user = project.owner;

    next();
  } catch (error) {
    console.error('API key validation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

