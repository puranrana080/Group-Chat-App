const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const User = require('./model/user')
const Message = require('./model/groupmessages')
const Group = require('./model/group')
const UserGroup = require('./model/usergroup')

const cron = require('node-cron')

const morgan = require('morgan')
const io = require('socket.io')(3001, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

require('dotenv').config()
const Sequelize = require('sequelize')
const sequelize = require('./util/database')
const userRoutes = require('./routes/user')
const groupchatRoutes = require('./routes/groupchat')
const groupListRoutes = require('./routes/grouplist')
const groupDetailsRoutes = require('./routes/groupdetails')
const socketController = require('./controller/socketController');
const { archieveOldMessages } = require('./services/archieveService')
const archivedOldMessages = require('./services/archieveService')


app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000"
}))
app.use(morgan('combined'))

app.use(userRoutes)
app.use(groupchatRoutes)
app.use(groupListRoutes)
app.use(groupDetailsRoutes)

app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/login.html`));
})
//socket

io.on('connection', socketController.handleConnection);


User.hasMany(Message, { onDelete: 'CASCADE' })
Message.belongsTo(User, { onDelete: 'CASCADE' })

User.belongsToMany(Group, { through: UserGroup })
Group.belongsToMany(User, { through: UserGroup })

Group.hasMany(Message, { onDelete: 'CASCADE' })
Message.belongsTo(Group, { onDelete: 'CASCADE' })


sequelize.sync()
    // sequelize.sync({force:true})
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("inside 3000 port")
        })
    })
    .catch(err => {
        console.log(err)
    })


//cron jon running every night at 00
cron.schedule('31 1 * * *', async () => {
    console.log("cron job started at 00:00")
    try {
        const result = await archivedOldMessages()
        console.log(result)
    }
    catch (error) {
        console.log("Error in scheduling archiving", error)
    }
}, { timezone: 'Asia/Kolkata' })