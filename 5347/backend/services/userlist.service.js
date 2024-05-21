const UserlistModel = require('../models/userlist');
const ContributionModel = require('../models/contributions');
const FavouritesModel = require('../models/favourites'); 
const ContributionsModel = require('../models/contributions'); 
const getAllAdminIds = require('../services/adminlist.service').getAllAdminIds;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.getUserById = async (userId) => {
  try {
    const user = await UserlistModel.findById(userId)
      .select('-password'); // Remove the password field to protect user privacy
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.log('Error in getUserById:', error);
    throw new Error('Failed to get user');
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await UserlistModel.find().select('-password'); // Remove password information to protect user privacy
    const adminIds = await getAllAdminIds(); // Get the _id of all administrators

    const adminIdSet = new Set(adminIds); // Create a Set to quickly check the _id

    // Iterate through the list of users, adding isAdmin tags for each user
    const usersWithAdminFlag = users.map(user => ({
      ...user.toObject(), // Convert a Mongoose document to a normal object
      isAdmin: adminIdSet.has(user._id.toString()) // Check whether the user is an administrator
    }));

    return usersWithAdminFlag;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch users');
  }
};

exports.createUser = async (userData) => {
  try {
    const user = await UserlistModel.create(userData);
    return user;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

exports.updateUser = async (userId, updateData) => {
  try {
    const user = await UserlistModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    return user;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

exports.getUserProfile = async (userId) => {
  try {
    // Populate favorites and contributions
    const userProfile = await UserlistModel.findById(userId)
      .populate({
        path: 'favorites',
        model: FavouritesModel
      })
      .populate({
        path: 'contributions',
        model: ContributionsModel
      })
      .select('-password'); // Omit sensitive info like passwords
    return userProfile;
  } catch (error) {
    throw new Error('Failed to get user profile');
  }
};

exports.favoriteCharacter = async (userId, characterId) => {
  try {
    await UserlistModel.findByIdAndUpdate(userId, {
      $addToSet: { favorites: characterId },
    });
  } catch (error) {
    throw new Error('Failed to add character to favorites');
  }
};

exports.revokeContribution = async (userId, contributionId) => {
  try {
    const contribution = await ContributionModel.findOne({
      _id: contributionId,
      user: userId,
      status: 'Pending',
    });

    if (!contribution) {
      throw new Error('Contribution not found or cannot be revoked');
    }

    await ContributionModel.findByIdAndDelete(contributionId);
    await UserlistModel.findByIdAndUpdate(userId, {
      $pull: { contributions: contributionId },
    });
  } catch (error) {
    throw new Error('Failed to revoke contribution');
  }
};