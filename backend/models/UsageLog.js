import mongoose from 'mongoose';

const usageLogSchema = new mongoose.Schema({
  keyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  endpoint: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true,
  },
});

export default mongoose.model('UsageLog', usageLogSchema);

