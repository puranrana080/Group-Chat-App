const Sequelize = require('sequelize')

const sequelize = new Sequelize("groupchat", "root", "Root@5544", {  //password for window root5544
    dialect: "mysql",
    host: "localhost"
})

module.exports = sequelize