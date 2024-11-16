const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const groupChatController = require('../controller/groupchat')
const userauthentication = require('../middleware/auth')

router.get('/groupchat', groupChatController.getGroupChat)

router.get('/groupchat/users', userauthentication.authenticate, groupChatController.getLoggedUsers)

router.post('/groupchat/sendChat', userauthentication.authenticate, groupChatController.postSendChat)

router.get('/groupchat/groupmessages', userauthentication.authenticate, groupChatController.getAllGroupChat)

router.post('/groupchat/uploadImageToS3', userauthentication.authenticate,upload.single('image') ,groupChatController.uploadImageToS3)

module.exports = router