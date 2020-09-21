const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    message: {
        type: String,
        required: true,
    },

    chatRoom: {
        ref: 'chatroom',
        type: Schema.Types.ObjectId
    },

    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
});

module.exports = model('messages', messageSchema);
