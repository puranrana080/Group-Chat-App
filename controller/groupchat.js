const User = require('../model/user')
const path = require('path')
const Message = require('../model/groupmessages')




exports.getGroupChat = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/groupchat.html'))


}

exports.getLoggedUsers = async (req, res, next) => {
    try {
        const loggedUsers = await User.findAll({ attributes: ['userName'] })
        res.status(200).json({ allUsers: loggedUsers })
    }
    catch (error) {
        res.status(500).json({ error: "error in getting users" })
    }
}

exports.postSendChat = async (req, res, next) => {

    try {
        console.log("Hey 1", req.body)
        console.log("Hey 2", req.user)

        await Message.create({
            userMessage: req.body.message,
            userId: req.user.id

        })

        res.status(200).json({ message: "all ok " })


    }
    catch (error) {
        res.status(500).json({ error: "error in sending msg" })

    }
}
