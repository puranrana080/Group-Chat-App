const express = require('express')
const router = express.Router()
const User = require('../model/user')
const path = require('path')
const bcrypt = require('bcrypt')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'))
})

router.post('/user/register', async (req, res, next) => {

    try {
        const { userName, userEmail, userPhone, password } = req.body
        console.log(req.body)
        const existingUser = await User.findOne({ where: { userEmail: userEmail } })


        if (existingUser) {
            return res.status(400).json({ message: "User already exist , try other email" })

        }
        const saltRounds = 10
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.log(err)
            }
            await User.create({
                userName,
                userEmail,
                userPhone,
                password: hash
            })
        })


        res.status(200).json({ message: "Successfully Created new user" })
    }
    catch (err) {
        console.log("User not created", err)
        res.status(500).json({ message: "Internal server error" })
    }



})


module.exports = router