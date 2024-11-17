const Message = require('../model/groupmessages')
const ArchivedChat = require('../model/archivedchat')
const moment = require('moment')
const Sequelize = require('sequelize')





async function archivedOldMessages() {
    try {
        console.log("Cron job started archiving")

        const oneDayAgo = moment().subtract(1, 'day').toDate()
        const oldMessages = await Message.findAll({
            where: {
                createdAt: { [Sequelize.Op.lt]: oneDayAgo }
            }
        })
        if (oldMessages.length > 0) {
            await ArchivedChat.bulkCreate(
                oldMessages.map((msg) => ({
                    userId: msg.userId,
                    groupId: msg.groupId,
                    userMessage: msg.userMessage,
                    imageUrl: msg.imageUrl,
                    createdAt: msg.createdAt,
                    updatedAt: msg.updatedAt
                }))
            )
            await Message.destroy({
                where: {
                    createdAt: { [Sequelize.Op.lt]: oneDayAgo }
                }
            })


            return `${oldMessages.length} messages archived and deleted`
        }
        else {

            return 'no messges to archive'
        }
    }
    catch (error) {
        console.log("Error while archiving", error)
        throw error
    }
}

module.exports = archivedOldMessages;