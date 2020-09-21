const User = require('../models/User');

module.exports = {
    getOne: async (email) => {
        return User.findOne(email)
    },

    updateSocket: async (email, params) => {
        return User.updateOne(email, {
            $set: params
        })
    },

    createUser: async (params) => {
        const user = new User(params)
        return user.save()
    }
}
