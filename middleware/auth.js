const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../model/user')

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization')
        console.log("this is token", token)

        const user = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log(user.userId)
        User.findByPk(user.userId)
            .then(user => {
                req.user = user
                next()
            })
            .catch(err => {
                throw new Error(err)
            })
    }
    catch (error) {
        console.log("jwttttt", error)
    }


}

module.exports = { authenticate }