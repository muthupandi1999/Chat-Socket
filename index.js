// const http = require("http");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");


const app = express();
const path = require('path')
const http = require('http');

const { createServer } = require("http");

const { Server } = require("socket.io");

const server = createServer(app);
const io = new Server(server);

const bcrypt = require('bcryptjs')

const ChatMessage = require('./models/messageSchema');

const User = require('./models/User');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);




// const socketio = require( "socket.io");

// const http = require('http');
// const socketio = require('socket.io');
// mongo connection

const mongoose = require("mongoose");
// socket configuration
// import WebSockets from "./server/utils/WebSockets";

// const WebSockets = require('./server/utils/WebSockets')
// const indexRouter = require('./server/utils/WebSockets')
// const userRouter = require('./server/utils/WebSockets')
// const chatRoomRouter = require('./server/utils/WebSockets')
// routes
// import indexRouter from "./server/routes/index";
const userRouter = require("./routes/User");

const loginRouter = require('./routes/login');

const chatRoomRouter = require('./routes/room');

const messageRouter = require('./routes/message')

const { decode } = require('./middlewares/jwt');

const Message = require('./models/messageSchema')


// const server = http.createServer(app);


// Set up Socket.io
// const io = socketio(server);

/** Get port from environment and store in Express. */
const port = process.env.PORT || "4000";
app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//     res.send(`<h1> Hello World </h1>`)
// })

// const myMiddleware = (req, res, next) => {
//     require('/socket.io/socket.io.js');
//     next();
// };
//Serve public directory
app.use(express.static('public'));

// app.get('/index', (req, res) => {
//     res.sendFile(path.join(__dirname, +'public/index.html'));
// });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// app.use(myMiddleware);

app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/message", decode, messageRouter);
// app.use("/delete", deleteRouter);

mongoose.set('strictQuery', false)

// mongoose.connect('mongodb://localhost:27017/Chat-Socket', err => {
//     if(err)   console.log("DB is not connected")
//     console.log("DB is connected")
// })


mongoose.connect('mongodb://localhost:27017/ChatApp-Socket', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Mongo has connected succesfully')
})
mongoose.connection.on('reconnected', () => {
    console.log('Mongo has reconnected')
})
mongoose.connection.on('error', error => {
    console.log('Mongo connection has an error', error)
    mongoose.disconnect()
})
mongoose.connection.on('disconnected', () => {
    console.log('Mongo connection is disconnected')
})

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist'
    })
});

io.on('connection', (socket) => {

    console.log("id", socket.id);

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // socket.on('message', message => {
    //     console.log('message: ' + message);
    //     //Broadcast the message to everyone
    //     io.emit('message', message);
    // });


    socket.on('chat message', (data) => {
        const message = new ChatMessage({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
        });

        message.save()
            .then(data => {
                io.emit('chat message', data);
            })
            .catch(err => {
                console.error(err);
            });

    });

    socket.on('register', async (data) => {
        console.log("data", data)
        const { username, email, password } = data;

        const hashPassword = await bcrypt.hashSync(password, 10)
        const user = await new User({
            username: username,
            email: email,
            password: hashPassword
        });
        try {
            console.log("saved", user)
            await user.save();
            socket.emit('register success');
        } catch (error) {
            socket.emit('register failure');
        }
    });

    socket.on('login', async (data) => {

        console.log("data", data)
        const { email, password } = data;

        const emailExists = await User.findOne({ email: email });

        if (emailExists) {

            const validPassword = await bcrypt.compare(password, emailExists.password);

            if (validPassword) {

                socket.emit('login success');

            } else {

                socket.emit('login failure');

            }
        } else {

            socket.emit('login failure');

        }


        // const user = await new User({
        //     username: username,
        //     email: email,
        //     password: hashPassword
        // });
        // try {
        //     console.log("saved", user)
        //     await user.save();

        // } catch (error) {

        // }
    });

    // socket.on('message', function (data) {
    //     const message = new Message({
    //         text: data.text,
    //         user: data.user
    //     });
    //     message.save(function (err) {
    //         if (err) {
    //             console.error('Error saving message:', err);
    //         } else {
    //             console.log('Message saved successfully');
    //         }
    //     });

    //     io.emit('message', data);
    // });
});
// io.on('connection', (socket) => {

//     socket.on('newMessage', async (data) => {
//         // ...

//         // Create a new message
//         const message = new Message({ 
//             sender: socket.user._id,
//             receiver: receiver._id,
//             content: data.content,
//         });

//         await message.save();

//         // Convert the createdAt and updatedAt fields to local date and time format
//         const createdAt = message.createdAt.toLocaleString();
//         const updatedAt = message.updatedAt.toLocaleString();

//         // Send the message to the receiver's socket
//         const receiverSocket = io.sockets.connected[receiver.socketId];

//         if (receiverSocket) {
//             receiverSocket.emit('newMessage', {
//                 _id: message._id,
//                 sender: message.sender,
//                 receiver: message.receiver,
//                 content: message.content,
//                 createdAt,
//                 updatedAt,
//             });
//         }
//     });
// })





/** Create HTTP server. */


/** Create socket connection */
// global.io = socketio.listen(server);
// global.io.on('connection', WebSockets.connection)
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`)
});