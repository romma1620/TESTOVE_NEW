const jwt = require('jsonwebtoken');
const {JWT} = require('../config/keys');

module.exports = (params) => {
    return jwt.sign({params}, JWT, {expiresIn: 60 * 60})
}
