const ContributionsModel = require('../models/contributions');
const CharactersModel = require('../models/characters');
const { isAdmin } = require("../services/adminlist.service");
const { updateCharacter } = require('./character.service');

exports.createContribution = async (contributionData) => {
  try {
    const contribution = await ContributionsModel.create(contributionData);
    return contribution;
  } catch (error) {
    throw new Error('Failed to create contribution');
  }
};

exports.getContributionById = async (contributionId) => {
  try {
    const contribution = await ContributionsModel.findById(contributionId).populate('user_id reviewed_by');
    return contribution;
  } catch (error) {
    throw new Error('Failed to get contribution');
  }
};

exports.updateContributionStatus = async (contributionId, status, reviewedBy) => {
  try {
    const contribution = await ContributionsModel.findByIdAndUpdate(
      contributionId,
      { status, reviewed_by: reviewedBy },
      { new: true }
    ).populate('user_id reviewed_by');
    return contribution;
  } catch (error) {
    throw new Error('Failed to update contribution status');
  }
};

exports.getContributionHistory = async () => {
  try {
    const contributions = await ContributionsModel.find()
      .populate('user_id reviewed_by')
      .sort({ date: -1 }); 
    return contributions;
  } catch (error) {
    throw new Error('Failed to get contribution history');
  }
};

exports.addCharacter = async (userId, action, data) => {
  try {
    const isUserAdmin = await isAdmin(userId);

    const contributionData = {
      contribution_id: await getNextContributionId(),
      user_id: { _id: userId },
      action,
      data,
      status: isUserAdmin ? 'Approved' : 'Pending',
      reviewed_by: isUserAdmin ? { _id: userId } : null,
      date: new Date().toISOString(),
    };

    const contribution = await ContributionsModel.create(contributionData);
    if (isUserAdmin) {
      await CharactersModel.create(data);
    }

    return contribution;
  } catch (error) {
    console.error('Error in addCharacter:', error);
    throw new Error('Failed to add character');  }
};

exports.editCharacter = async (userId, action, data, characterId) => {
  try {
    const isUserAdmin = await isAdmin(userId);

    const existingContribution = await ContributionsModel.findOne({ 'data.id': characterId, status: 'Pending' });

    if (existingContribution) {
      throw new Error('Character is being edited by another user');
    }
    
    const contributionData = {
      contribution_id: await getNextContributionId(),
      user_id: { _id: userId },
      action,
      status: isUserAdmin ? 'Approved' : 'Pending',
      reviewed_by: isUserAdmin ? { _id: userId } : null,
      date: new Date().toISOString(),
      data: { id: characterId, ...data }
    };

    const contribution = await ContributionsModel.create(contributionData);
    if (isUserAdmin && action === 'EditCharacter') {
      await updateCharacter(characterId, data); 
    }

    return contribution;
  } catch (error) {
    console.error('Failed to edit character:', error);
    throw error;
  }
};

async function getNextContributionId() {
  try {
    const contributions = await ContributionsModel.aggregate([
      {
        $addFields: {
          numeric_id: {
            $convert: {
              input: "$contribution_id",
              to: "int",
              onError: "Error converting contribution_id to int",
              onNull: "No contribution_id found"
            }
          }
        }
      },
      { $sort: { numeric_id: -1 } },
      { $limit: 1 }
    ]);

    if (contributions.length > 0 && contributions[0].numeric_id != null) {
      const nextId = contributions[0].numeric_id + 1;
      console.log(`Next contribution ID generated successfully: ${nextId}`);
      return nextId.toString();
    } else {
      console.error('No valid contributions found or error in conversion, starting IDs at 1');
      return "1";
    }
  } catch (error) {
    console.error('Error in getNextContributionId:', error);
    throw new Error('Failed to generate next contribution ID');
  }
}

exports.reviewContribution = async (userId, contributionId, status) => {
  try {

    const isUserAdmin = await isAdmin(userId);

    if (!isUserAdmin) {
      throw new Error('You do not have permission to approve contributions');
    }

    const contribution = await ContributionsModel.findOne({ contribution_id: contributionId });

    if (!contribution) {
      throw new Error('Contribution not found');
    }

    contribution.status = status;
    contribution.reviewed_by = { _id: userId };
    await contribution.save();

    if (status === "Approved") {
      if (contribution.action === 'AddCharacter') {
        await CharactersModel.create(contribution.data);
      } else if (contribution.action === 'EditCharacter') {
        await updateCharacter(contribution.data.id, contribution.data);
      }
    }

    return contribution;
  } catch (error) {
    console.error('Failed to review contribution:', error);
    throw error;
  }
};