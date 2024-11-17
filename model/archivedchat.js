const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const ArchivedChat = sequelize.define('archivedchat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userMessage: {
        type: Sequelize.STRING

    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATE

    },
    updatedAt: {
        type: Sequelize.DATE

    },
    userId: {
        type: Sequelize.INTEGER

    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: true

    }
})

module.exports = ArchivedChat;