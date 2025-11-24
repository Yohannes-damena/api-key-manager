import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  hashedKey: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    enum: ['live', 'test'],
    default: 'live',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUsedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'revoked'],
    default: 'active',
  },
});

export default mongoose.model('ApiKey', apiKeySchema);

