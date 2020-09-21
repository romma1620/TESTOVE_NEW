const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const {authService} = require('../../services');
const {tokinaizer} = require('../../helpers')

const errorHandler = require('../../error');

module.exports = {
    login: async (req, res) => {
        try {
            const {email, password} = req.body;
            const candidate = await authService.getOne({email});

            if (!candidate) {
                return res.status(404).json({
                    message: 'User is not exist'
                })
            }

            const passwordResult = bcrypt.compareSync(password, candidate.password);

            if (!passwordResult) {
                throw new errorHandler('invalid');
            }

            const token = tokinaizer({
                email: candidate.email,
                userId: candidate._id
            })

            await authService.updateSocket({email}, {socketId: req.get('socketId')})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } catch (e) {
            errorHandler(res, e)
        }

    },

    register: async (req, res) => {

        try {
            const {email, name, surname, password} = req.body
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const user = await authService.createUser({
                email,
                password: hashPassword,
                name,
                surname
            });

            res.status(201).json(user)
        } catch (e) {
            throw new Error(e)
        }
    }
};
