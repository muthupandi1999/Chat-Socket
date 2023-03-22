const express = require('express');
// controllers
const Message = require('../controllers/message');

const router = express.Router();

router
    .post('/', Message.postMessage)
    .post('/person', Message.postMessageByPerson)
    .get('/:userId', Message.getMessages)
    // .delete('/:id', Room.deleteRoomById)
    // .post("/join", Room.addUsers)

module.exports = router;


