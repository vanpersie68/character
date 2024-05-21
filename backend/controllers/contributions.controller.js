// const contributionsService = require('./contributions.service');
const { verifyToken } = require("../services/auth.service");
const { createContribution, getContributionById, updateContributionStatus, getContributionHistory, addCharacter, editCharacter, reviewContribution } = require("../services/contributions.service");

exports.createContribution = async (req, res, next) => {
  try {
    const contributionData = req.body;
    const newContribution = await createContribution(contributionData);
    res.status(200).json({ message: "Contribution created successfully", contribution: newContribution });
  } catch (error) {
    next(error);
  }
};

exports.getContributionById = async (req, res, next) => {
  try {
    const { contributionId } = req.params;
    const contribution = await getContributionById(contributionId);
    res.json({ contribution });
  } catch (error) {
    next(error);
  }
};

exports.getContributionHistory = async (req, res, next) => {
  try {
    const contributions = await getContributionHistory();
    
    const formattedContributions = contributions.map(contribution => ({
      _id: contribution._id,
      contribution_id: contribution.contribution_id,
      user_id: contribution.user_id,
      action: contribution.action,
      status: contribution.status,
      reviewed_by: contribution.reviewed_by,
      date: contribution.date,
      data: contribution.data
    }));
    
    res.json({ 
      message: "Contributions retrieved successfully",
      data: formattedContributions
    });
  } catch (error) {
    next(error);
  }
};

exports.updateContributionStatus = async (req, res, next) => {
  try {
    const { contributionId } = req.params;
    const { status, reviewedBy } = req.body;
    const updatedContribution = await updateContributionStatus(contributionId, status, reviewedBy);
    res.json({ message: "Contribution status updated successfully", contribution: updatedContribution });
  } catch (error) {
    next(error);
  }
};

exports.addCharacter = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await verifyToken(token);
    const userId = decodedToken.userId;
    const { action, data } = req.body;

    contribution = await addCharacter(userId, action, data);
    res.status(200).json({ message: "Character added successfully", contribution });
  } catch (error) {
    next(error);
  }
};

exports.editCharacter = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await verifyToken(token);
    const userId = decodedToken.userId;

    const { action, data } = req.body;
    const characterId = req.params.characterId;
    const contribution = await editCharacter(userId, action, data, characterId);

    res.status(200).json({ message: "Character edited successfully", contribution });

  } catch (error) {
    // If edited by someone else, return 403: message: Character is being edited by another user.

    if (error.message === 'Character is being edited by another user') {
      res.status(403).json({ message: 'Character is being edited by another user' });
    } else {
      next(error);
    }
  }
};


exports.reviewContribution = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await verifyToken(token);
    const userId = decodedToken.userId;

    const contributionId = req.params.contributionId;
    const { status, reviewed_by  } = req.body;

    // Check whether status and reviewed_by exist
    if (!status || !reviewed_by || !reviewed_by._id) {
      return res.status(400).json({ message: "Invalid review data" });
    }

    const result = await reviewContribution(userId, contributionId, status);

    res.status(200).json({ message: "Contribution reviewed successfully", result });
  } catch (error) {
    next(error);
  }
};
