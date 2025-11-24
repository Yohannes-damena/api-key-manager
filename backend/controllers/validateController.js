import ApiKey from '../models/ApiKey.js';
import Project from '../models/Project.js';
import UsageLog from '../models/UsageLog.js';
import { compareApiKey } from '../utils/hashApiKey.js';

export const validateKey = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.body.apiKey;

    if (!apiKey) {
      return res.status(401).json({ valid: false, error: 'API key is required' });
    }

    // Find all active API keys
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
      return res.status(401).json({ valid: false, error: 'Invalid API key' });
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

    res.json({
      valid: true,
      project: {
        id: project._id,
        name: project.name,
      },
      key: {
        id: matchedKey._id,
        prefix: matchedKey.prefix,
        createdAt: matchedKey.createdAt,
        lastUsedAt: matchedKey.lastUsedAt,
      },
    });
  } catch (error) {
    console.error('Validate key error:', error);
    res.status(500).json({ valid: false, error: 'Internal server error' });
  }
};

