// models/contributions.js
const mongoose = require('mongoose');

const contributionsSchema = new mongoose.Schema({
  contribution_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userlist',
      required: true,
    },
  },
  action: {
    type: String,
    enum: ['AddCharacter', 'EditCharacter', 'DeleteCharacter'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  reviewed_by: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userlist',
    },
  },
  date: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
}, 
{ 
  timestamps: false, versionKey: false 
});

module.exports = mongoose.models.ContributionsModel || mongoose.model("contributions", contributionsSchema);
