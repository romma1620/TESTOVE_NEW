const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const {authRouter, chatRouter} = require('./routes');
const keys = require('./config/keys');

const port = process.env.PORT || 1616;

const app = express();

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const io = require('socket.io').listen(app.listen(port, () => console.log(`Server start on ${port}`)));

app.use((req, res, next) => {
    req.io = io;
    next();
})

require("./models/User");
require("./models/Message");

const Message = mongoose.model('messages');
const User = mongoose.model('users');

io.sockets.on('connect', async (socket) => {

    const token = socket.handshake.query.token;
    console.log(token)
    console.log(`Connected ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Disconnected ${socket.id} `)
    })

    socket.on('joinRoom', ({chatroomId}) => {
        socket.join(chatroomId);
        console.log('User join chatroom: ' + chatroomId)
    })

    socket.on('leaveRoom', ({chatroomId}) => {
        socket.leave(chatroomId);
        console.log('User leave chatroom: ' + chatroomId)
    })

    socket.on('chatroomMessage', async ({chatroomId, message}) => {
        if (message.trim().length > 0) {
            const user = await User.findOne({socketId: socket.id})

            if (!user){
                throw new Error('User not found')
            }

            const newMessage = new Message({
                chatroom: chatroomId,
                user: user._id,
                message
            });

            io.to(chatroomId).emit('newMessage', {
                message,
                name: user.name,
                surname: user.surname,
                userId: user._id,
            });

            await newMessage.save();

        }
    })
});

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

app.use('*', (err, req, res, next) => {
    res
        .status(err.status || 404)
        .json({
            message: err.message || 'NOT FOUND',
            code: err.customCode || ''
        })
})

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'build', 'static', 'index.html'
            )
        )
    })
}
