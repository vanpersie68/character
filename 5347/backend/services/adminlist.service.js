const AdminlistModel = require('../models/adminlist');
const UserlistModel = require('../models/userlist');

exports.getAdminById = async (adminId) => {
  try {
    const admin = await AdminlistModel.findById(adminId);
    return admin;
  } catch (error) {
    throw new Error('Failed to get admin');
  }
};

exports.getAllAdminIds = async () => {
  try {
    const admins = await AdminlistModel.find(); 
    return admins.map(admin => admin._id.toString()); 
  } catch (error) {
    console.error('Error fetching admin IDs:', error);
    throw new Error('Failed to fetch admin IDs');
  }
};

exports.toggleAdminRole = async (userId) => {
  const admin = await AdminlistModel.findById(userId);
  let message, wasPromoted;

  if (admin) {
    await AdminlistModel.findByIdAndDelete(userId);
    message = 'Success demote admin';
    wasPromoted = false;
  } else {
    await AdminlistModel.create({ _id: userId });
    message = 'Success promote user';
    wasPromoted = true;
  }

  return { message, wasPromoted };
};


exports.isAdmin = async (userId) => {
  try {
    const admin = await AdminlistModel.findOne({ _id: userId });
    console.log("1111111", admin);
    return !!admin;
  } catch (error) { 
    throw new Error('Failed to check admin status');
  }
};
