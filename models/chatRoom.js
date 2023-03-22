const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    name: String,
    users: [String],
    chatopener:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}]
});
const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;

