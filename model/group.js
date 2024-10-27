const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Group = sequelize.define('groups', {
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    createdBy: {
        type: Sequelize.STRING,
        allowNull: false
    },

})

module.exports = Group