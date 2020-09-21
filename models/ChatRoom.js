const {Schema, model} = require('mongoose');

const chatRoomSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = model('chatroom', chatRoomSchema)
