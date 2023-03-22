const express = require('express');
// controllers
const user = require('../controllers/user.js');

const router = express.Router();

router
    .get('/', user.getAllUsers)
    .post('/', user.createUser)
    .get('/:id', user.getUserById)
    .delete('/:id', user.deleteUserById)

module.exports =  router;