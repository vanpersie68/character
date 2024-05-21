const { getAllUsers, getFavouritesByUserId, getContributionsByUserId, getUserById, updateUser, getUserProfile, favoriteCharacter, revokeContribution } = require("../services/userlist.service");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const userlist = require("../models/userlist");
const Contributions = require('../models/contributions'); 
const getAllAdminIds = require('../services/adminlist.service').getAllAdminIds;

exports.revoke = async (req, res, next) => {
  try {
    const { contributionId } = req.params;

    // Find and update documents that match the criteria
    const updatedContribution = await Contributions.findOneAndUpdate(
      {
        _id: contributionId,
        reviewed_by: null,
        status: "Pending"
      },
      {
        $set: { status: "Rejected" }
      },
      { new: true }  // Returns the updated document
    );

    if (updatedContribution) {
      res.status(200).json(updatedContribution);
    } else {
      res.status(404).json({ message: "No eligible contribution found to revoke." });
    }
  } catch (error) {
    console.error('Error in revoke:', error);
    res.status(500).json({ message: "Internal server error" });
    next(error);
  }
};


exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userInfo = await userlist.aggregate([
      {
          $match: {
              _id: new ObjectId(userId),
          }
      },
      {
          $lookup: {
              from: 'contributions', 
              localField: '_id',
              foreignField: 'user_id._id',
              as: 'contributions'
          }
      },
      {
          $unwind: "$contributions" // Expand contributions to make it easier to access individual elements
      },
      {
          $lookup: {
              from: 'userlist', // Find the user corresponding to reviewed_by
              localField: 'contributions.reviewed_by._id',
              foreignField: '_id',
              as: 'reviewerDetails'
          }
      },
      {
          $addFields: {
              "contributions.reviewed_by_name": {
                  $concat: [
                      { $arrayElemAt: ["$reviewerDetails.firstname", 0] },
                      " ",
                      { $arrayElemAt: ["$reviewerDetails.lastname", 0] }
                  ]
              }
          }
      },
      {
          $group: { // Regroup to restore the original document structure
              _id: "$_id",
              root: { $mergeObjects: "$$ROOT" },
              contributions: { $push: "$contributions" }
          }
      },
      {
          $replaceRoot: {
              newRoot: { $mergeObjects: ["$root", "$$ROOT"] }
          }
      },
      {
          $lookup: {
              from: 'favourites', // Find again favourites
              localField: '_id',
              foreignField: 'user_id._id',
              as: 'favourites'
          }
      },
      {
          $project: { //Final projection to exclude unwanted fields
              'contributions.reviewed_by': 0,
              'contributions.contribution_id': 0,
              'contributions.user_id': 0,
              'contributions.date': 0,
              'contributions.data.name': 0,
              'contributions.data.subtitle': 0,
              'contributions.data.description': 0,
              'contributions.data.image_url': 0,
              'contributions.data.strength': 0,
              'contributions.data.speed': 0,
              'contributions.data.skill': 0,
              'contributions.data.fear_factor': 0,
              'contributions.data.power': 0,
              'contributions.data.intelligence': 0,
              'contributions.data.wealth': 0,
              'root': 0,
              'reviewerDetails': 0, 
              'favourites._id': 0,
              'favourites.user_id': 0,
          }
      }
  ]);


  const adminIds = await getAllAdminIds(); // Get the _id of all administrators
  const adminIdSet = new Set(adminIds); // Create a Set to quickly check the _id
  user = userInfo[0];
  const updatedUser = {
    ...user,  //If the user is a Mongoose document, make sure to convert it to a normal object
    isAdmin: adminIdSet.has(user._id.toString())  // Check whether _id is in the administrator collection
  };
  userInfo[0]  = updatedUser;
  res.json( userInfo );
  } catch (error) {
    console.error('Error in getUserById:', error);
    next(error);
  }
};


exports.getAllUser = async (req, res, next) => {
  try {
    const users = await getAllUsers(); // Invoke the service layer method to obtain all user information
    res.json({ users }); // Send the user list in response
  } catch (error) {
    console.error('Error in getAllUser:', error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};


exports.createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await createUser(userData);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const updatedUser = await updateUser(userId, updateData);
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ userProfile });
  } catch (error) {
    next(error);
  }
};

exports.favoriteCharacter = async (req, res, next) => {
  try {
    const { userId, characterId } = req.params;
    await favoriteCharacter(userId, characterId);
    res.json({ message: "Character added to favorites successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await getUserById(userId);
    res.json({
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        favorites: user.favorites,
        contributions: user.contributions,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.revokeContribution = async (req, res, next) => {
  try {
    const { userId, contributionId } = req.params;
    await revokeContribution(userId, contributionId);
    res.json({ message: "Contribution revoked successfully" });
  } catch (error) {
    next(error);
  }
};