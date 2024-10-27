const express = require('express')
const router = express.Router()

const newgroupController = require('../controller/newGroup')
const userauthentication = require('../middleware/auth')

router.post('/grouplist/create-group', userauthentication.authenticate, newgroupController.createNewGroup)

router.get('/grouplist/user-allgroup',userauthentication.authenticate,newgroupController.getUserAllGroups)

module.exports = router