const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const User = sequelize.define('users', {
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    userPhone: {
        type: Sequelize.BIGINT,
        allowNull: false,

    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = User