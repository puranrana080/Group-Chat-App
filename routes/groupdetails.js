const express = require('express')
const router = express.Router()
const userauthentication = require('../middleware/auth')
const userInGroupsDetailsController = require('../controller/groupdetails')

router.get('/groupdetails/:groupId/groupName', userauthentication.authenticate, userInGroupsDetailsController.getGroupName)

router.get('/groupdetails/:groupId/members', userauthentication.authenticate, userInGroupsDetailsController.getAllGroupMembers)

router.get('/groupdetails/:groupId/available-users', userauthentication.authenticate, userInGroupsDetailsController.getNewUsersAvailable)

router.post('/groupdetails/:groupId/add-member', userauthentication.authenticate, userInGroupsDetailsController.addNewMemberToGroup)

router.post('/groupdetails/:groupId/promote', userauthentication.authenticate, userInGroupsDetailsController.promoteMemberToAdmin)

router.post('/groupdetails/:groupId/remove', userauthentication.authenticate, userInGroupsDetailsController.removeMemberFromGroup)

module.exports = router