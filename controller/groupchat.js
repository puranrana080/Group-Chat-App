const User = require('../model/user')
const path = require('path')
const Message = require('../model/groupmessages')
const { Op } = require('sequelize')



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

exports.getAllGroupChat = async (req, res, next) => {
    try {
        const lastMsgId = parseInt(req.query.msgId)

        let allMsg
        if (lastMsgId) {
            allMsg = await Message.findAll({
                where:
                {
                    id: {
                        [Op.gt]: lastMsgId
                    }
                }
            })
        }
        else {
            allMsg = await Message.findAll()
        }
        const messagesWithUsers = []

        for (let message of allMsg) {
            const user = await message.getUser()

            messagesWithUsers.push({
                userMessage: message.userMessage,
                userName: user.userName,
                msgId: message.id
            })
        }

        res.status(200).json({ allChat: messagesWithUsers })
    }
    catch (error) {
        console.log("Error retriving message", error)
        res.status(500).json({ error: error })
    }
}
