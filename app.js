const express = require('express')
const path = require('path')
const app = express()
const cors =require('cors')
const User = require('./model/user')

const sequelize = require('./util/database')
const userRoutes = require('./routes/user')
const groupchatRoutes=require('./routes/groupchat')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000"
}))

app.use(userRoutes)
app.use(groupchatRoutes)




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
