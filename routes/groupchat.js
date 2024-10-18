const express = require('express')
const router = express.Router()

const groupChatController = require('../controller/groupchat')
const userauthentication = require('../middleware/auth')

router.get('/groupchat', groupChatController.getGroupChat)

router.get('/groupchat/users', userauthentication.authenticate, groupChatController.getLoggedUsers)

router.post('/groupchat/sendChat', userauthentication.authenticate, groupChatController.postSendChat)

router.get('/groupchat/groupmessages',userauthentication.authenticate,groupChatController.getAllGroupChat)

module.exports = router