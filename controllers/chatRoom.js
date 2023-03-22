const Room = require('../models/chatRoom');


const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();

        return res.status(200).json({
            success: true,
            rooms
        })
    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

const getRoomById = async (req, res) => {
    try {
        await Room.findOne({ _id: req.params.id })
            .then((room) => {
                return res.status(200).json({ success: true, room });
            })
            .catch((err) => {
                console.log(err);
            });


    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

const createRoom = async (req, res) => {
    try {
        console.log("hloo", io);


        const chatopener = req.userId;

        const { name, users } = req.body;

        console.log("user", users)

        if (users != undefined || null || "") {
            let room = await new Room({
                name: name,
                users: [users, chatopener],
                chatopener: chatopener
            })
            await room.save();
            return res.status(200).json({ success: true, room });
        } else {
            let room = await new Room({
                name: name,
                users: [chatopener],
                chatopener: chatopener
            })
            await room.save();
            return res.status(200).json({ success: true, room });
        }




    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

const deleteRoomById = async (req, res) => {
    try {
        await Room.findOne({ _id: req.params.id })
            .then((room) => {
                return res.status(200).json({
                    success: true,
                    message: `Deleted a count of ${user.deletedCount} user.`
                });
            })
            .catch((err) => {
                console.log(err);
            });

    } catch (error) {
        return res.status(500).json({ success: false, error: error })
    }
}

const addUsers = async (req, res) => {
    const { userid, roomid } = req.body;

    if (!userid || !roomid) {
        res.json("user and room required")
    } else {

        // const roomId = roomid; // User's ID to update
        const updateObject = { $push: { users: userid } };

        await Room.findByIdAndUpdate(roomid, updateObject, { new: true })
            .then((updatedUser) => {
                console.log("Updated user:", updatedUser);

                res.json({
                    messgae:"User added Successfully",
                    updatedUser
                })
            })
            .catch((error) => {
                console.error(error);
            });

     

    }
}


// const addUser = ({ id, user, room }) => {

//     user = user.trim().toLowerCase();
//     room = room.trim().toLowerCase();

//     if (!user || !room) {
//         return { error: 'name and room required' }
//     }

//     if (users.length) {
//         const data = users.find(e => e.user === user && e.room === room)

//         if (data) {
//             return { error: 'user already exist' }
//         }
//     }

//     const response = { id, user, room }

//     users.push(response)

//     console.log(users)

//     return { response };
// }



module.exports = { getAllRooms, getRoomById, createRoom, deleteRoomById, addUsers }
