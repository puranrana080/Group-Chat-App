const express = require('express')
const path = require('path')
const app = express()

const User = require('./model/user')

const sequelize = require('./util/database')
const userRoutes = require('./routes/register')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())

app.use(userRoutes)




sequelize.sync()
    // sequelize.sync({force:true})
    .then(() => {
        app.listen(3000, () => {
            console.log("inside 3000 port")
        })
    })
    .catch(err => {
        console.log(err)
    })
