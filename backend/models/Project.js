import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  keys: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Project', projectSchema);

