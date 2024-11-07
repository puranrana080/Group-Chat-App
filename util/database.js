const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {  //password for window root5544
    dialect: "mysql",
    host: process.env.DB_HOST
})

module.exports = sequelize