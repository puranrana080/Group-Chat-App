const User = require('../model/user')
const path = require('path')
const Message = require('../model/groupmessages')
const { Op } = require('sequelize')
const UserGroup = require('../model/usergroup')



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
            userId: req.user.id,
            groupId: req.body.groupId
        })

        res.status(200).json({ message: "all ok " })


    }
    catch (error) {
        res.status(500).json({ error: "error in sending msg" })

    }
}

exports.getAllGroupChat = async (req, res, next) => {
    try {
        const lastMsgId = parseInt(req.query.msgId) || 0
        const groupId = req.query.groupId && req.query.groupId !== 'null' ? parseInt(req.query.groupId) : null//if this exist?then do this:else do this
        if (isNaN(groupId)) {
            return res.status(400).json({ error: "Invalid groupId" });
        }
        const whereClause = {
            ...(groupId !== null ? { groupId } : { groupId: null }),
            ...(lastMsgId > 0 ? { id: { [Op.gt]: lastMsgId } } : {})
        }
        const allMsg = await Message.findAll({
            where: whereClause,
            include: [{ model: User, attributes: ['userName'] }]
        })
        const messagesWithUsers = []
        for (let message of allMsg) {
            const user = await message.getUser()

            messagesWithUsers.push({
                userMessage: message.userMessage,
                userName: user.userName,
                msgId: message.id
            })
        }
        //now getting user part of group
        let memberIDsJoined
        if (groupId > 0) {
            memberIDsJoined = await UserGroup.findAll({
                where: {
                    groupId: groupId
                },
                attributes: ['userId']
            })
        }
        else {
            memberIDsJoined = await UserGroup.findAll({
                attributes: ['userId']
            })
        }

        const userIds = memberIDsJoined.map(usergroup => usergroup.userId)
        // console.log("All the user IDS", userIds)
        const allUsers = await User.findAll({
            where:
                { id: userIds },
            attributes: ['userName']
        })
        // console.log("All the users", allUsers)

        res.status(200).json({ allChat: messagesWithUsers, allUsers: allUsers })
    }
    catch (error) {
        console.log("Error retriving message", error)
        res.status(500).json({ error: error.message })
    }
}
