const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Message = sequelize.define('messages', {
    userMessage: {
        type: Sequelize.STRING,
        allowNull: false

    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = Message
