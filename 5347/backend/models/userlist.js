const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userlistSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(value);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
  collection: "userlist",
  // timestamps: true,
});

userlistSchema.virtual('fullName').get(function () {
  return `${this.firstname} ${this.lastname}`;
});

userlistSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const UserlistModel = mongoose.models.userlist || mongoose.model('userlist', userlistSchema);

module.exports = UserlistModel;