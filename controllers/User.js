const User = require('../models/User');


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

const getUserById = async (req, res) => {
    try {
        await User.findOne({ _id: req.params.id })
            .then((user) => {
                return res.status(200).json({ success: true, user });
            })
            .catch((err) => {
                console.log(err);
            });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

const createUser = async (req, res) => {
    try {



        const { firstName, lastName, email } = req.body;
        const user = await new User({
            firstName: firstName,
            lastName: lastName,
            email: email
        })
        await user.save();
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

const deleteUserById = async (req, res) => {
    try {
        const user = await User.deleteByUserById(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Deleted a count of ${user.deletedCount} user.`
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

module.exports = { getAllUsers, getUserById, createUser, deleteUserById };
