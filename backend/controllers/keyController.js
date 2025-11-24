import ApiKey from '../models/ApiKey.js';
import Project from '../models/Project.js';
import { hashApiKey } from '../utils/hashApiKey.js';
import { generateApiKey as generateKey } from '../utils/generateApiKey.js';

export const generateKeyForProject = async (req, res) => {
  try {
    const { projectId, prefix = 'live' } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Verify project exists and user owns it
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate new API key
    const rawKey = generateKey(prefix);
    const hashedKey = await hashApiKey(rawKey);

    // Store hashed key
    const apiKey = new ApiKey({
      projectId,
      hashedKey,
      prefix,
    });

    await apiKey.save();

    // Add key to project's keys array
    await Project.findByIdAndUpdate(projectId, {
      $push: { keys: apiKey._id },
    });

    // Return raw key only once
    res.status(201).json({
      id: apiKey._id,
      key: rawKey, // Only time raw key is returned
      prefix: apiKey.prefix,
      createdAt: apiKey.createdAt,
    });
  } catch (error) {
    console.error('Generate key error:', error);
    res.status(500).json({ error: 'Server error generating key' });
  }
};

export const getKeys = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Verify project exists and user owns it
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const keys = await ApiKey.find({ projectId })
      .select('-hashedKey') // Never return hashed keys
      .sort({ createdAt: -1 });

    res.json(keys);
  } catch (error) {
    console.error('Get keys error:', error);
    res.status(500).json({ error: 'Server error fetching keys' });
  }
};

export const revokeKey = async (req, res) => {
  try {
    const keyId = req.params.id;

    // Find key and verify project ownership
    const apiKey = await ApiKey.findById(keyId).populate('projectId');

    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Verify user owns the project
    if (apiKey.projectId.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Revoke key
    apiKey.status = 'revoked';
    await apiKey.save();

    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke key error:', error);
    res.status(500).json({ error: 'Server error revoking key' });
  }
};

