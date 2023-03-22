const express = require('express');
// controllers
const Room = require('../controllers/chatRoom');

const router = express.Router();



router
    .get('/', Room.getAllRooms)
    .post('/', Room.createRoom)
    .get('/:id', Room.getRoomById)
    .delete('/:id', Room.deleteRoomById)
    .post("/join", Room.addUsers)

module.exports = router;