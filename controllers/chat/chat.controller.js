const {chatroomService} = require('../../services');

module.exports = {
    createChatroom: async (req, res, next) => {
        try {
            const {name} = req.body;
            const chatRoomExists = await chatroomService.getOne({name});

            if (chatRoomExists) {
                return res.status(406).json({
                    message: 'ChatRoom with this name is already exist'
                })
            }

            const chatRoom = chatroomService.createChatroom({name});
            await chatRoom.save()

            res.json({
                message: 'ChatRoom created'
            })
        } catch (e) {
            next(e);
        }
    },

    getAllChatrooms: async (req, res, next) => {
        try {
            const chatrooms = await chatroomService.getAll();

            res.json(chatrooms);
        }catch (e) {
            next(e)
        }
    }
};
