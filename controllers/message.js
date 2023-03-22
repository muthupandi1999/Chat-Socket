const router = require("express").Router();
const Message = require("../models/messageSchema");
const Room = require('../models/chatRoom')

//add

const postMessage = async (req, res) => {

    const { roomId, message } = req.body;

    const userId = req.userId;

    const A = await Room.findOne({_id:roomId});

    console.log(A.users)

    console.log(typeof req.userId)

    const newMessage = await new Message({
        roomId: roomId,
        userId: userId,
        UserReciever:A.users,
        message: message,

    });

    console.log(newMessage)

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
}

const postMessageByPerson = async (req, res) => {
    const { receiverId, message } = req.body;

    const userId = req.userId;

    console.log(typeof req.userId)

    const newMessage = await new Message({
        receiverId: receiverId,
        userId: userId,
        message: message
    });

    console.log(newMessage)

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
}

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            userId: req.params.userId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { postMessage, getMessages, postMessageByPerson }
