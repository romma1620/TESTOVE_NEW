const ChatRoom = require('../models/ChatRoom');

module.exports = {
    getAll: async () => {
        return ChatRoom.find({})
    },

    getOne: async (name) => {
        return ChatRoom.findOne(name)
    },

    createChatroom:  (name) => {
        return new ChatRoom(name)
    }
}
