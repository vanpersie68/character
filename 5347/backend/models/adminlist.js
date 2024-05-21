// models/adminlist.js
const mongoose = require('mongoose');

const adminlistSchema = new mongoose.Schema({

}
,{
    collection: "adminlist"
});

const AdminlistModel = mongoose.model('adminlist', adminlistSchema);

module.exports = AdminlistModel;