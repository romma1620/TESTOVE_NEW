const User = require('../../models/User');
const {authService} = require('../../services');

module.exports = async (req, res, next) => {

    const {email} = req.body;
    const candidate = await authService.getOne({email});

    if (candidate) {
        return res.status(409).json({
            message: 'User with this email exist! Try another email please.'
        });
    }
    next();
}
