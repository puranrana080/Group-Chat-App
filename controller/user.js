const User = require('../model/user')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.getRegisterForm = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'))
}

exports.postRegisterForm = async (req, res, next) => {

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



}

function generateAccessToken(id) {
    return jwt.sign({ userId: id }, 'secretecodeTOKEN')
}


exports.postUserLogin = async (req, res, next) => {

    try {
        console.log("body", req.body)
        const userAvailable = await User.findOne({
            where: { userEmail: req.body.userEmail }
        })
        console.log("this is user", userAvailable)
        if (userAvailable) {
            const isPasswordValid = await bcrypt.compare(req.body.userPassword, userAvailable.password)

            if (isPasswordValid) {
                console.log("Login Successful")
                return res.status(200).json({ message: "logged In", token: generateAccessToken(userAvailable.id) })
            }
            else {
                console.log("Password Wrong")
                res.status(401).json({ message: "User Not authorized" })
            }
        }
        else {
            console.log("Not logged In ")
            res.status(404).json({ message: "User not found" })
        }


    }
    catch (error) {
        res.status(500).json({ message: "Internal Error" })

    }

}



