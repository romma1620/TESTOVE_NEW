const {chatroomService} = require("../../services");

module.exports = async (req, res, next) => {

    const {name} = req.body;
    const chatRoomExists = await chatroomService.getOne({name});

    if (chatRoomExists) {
        return res.status(406).json({
            message: 'ChatRoom with this name is already exist'
        });
    }

    next()
}
