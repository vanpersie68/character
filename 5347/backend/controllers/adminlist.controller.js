const { toggleAdminRole, promoteUser, demoteAdmin, approveCharacterChanges, deleteCharacter } = require("../services/adminlist.service");
const adminlistController = require('../controllers/adminlist.controller');

//exports.getAdminById = adminlistController.getAdminById;

exports.getAdminById = async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const admin = await AdminlistModel.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    next(error);
  }
};

exports.promoteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const promotedUser = await promoteUser(userId);
    res.json({ message: "User promoted to admin successfully", user: promotedUser });
  } catch (error) {
    next(error);
  }
};

exports.demoteAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const demotedAdmin = await demoteAdmin(userId);
    res.json({ message: "Admin demoted to user successfully", user: demotedAdmin });
  } catch (error) {
    next(error);
  }
};

exports.editRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await toggleAdminRole(userId);
    res.json({ message: result.message, wasPromoted: result.wasPromoted });
  } catch (error) {
    res.status(500).json({ message: "Failed to modify user's role", error: error.message });
    next(error);
  }
};

exports.approveCharacterChanges = async (req, res, next) => {
  try {
    const { changeId } = req.params;
    const approvedChange = await approveCharacterChanges(changeId);
    res.json({ message: "Character changes approved successfully", change: approvedChange });
  } catch (error) {
    next(error);
  }
};

exports.deleteCharacter = async (req, res, next) => {
  try {
    const { characterId } = req.params;
    await deleteCharacter(characterId);
    res.json({ message: "Character deleted successfully" });
  } catch (error) {
    next(error);
  }
};