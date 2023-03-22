// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//     roomId: String,
//     userId: String,
//     receiverId:String,
//     UserReciever:Array,
//     message: String


// },{timestamps:true});
// const Message = mongoose.model('Message', messageSchema);

// module.exports = Message;

const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

module.exports = ChatMessage;