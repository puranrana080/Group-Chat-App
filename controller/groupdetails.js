const { Op } = require('sequelize')
const UserGroup = require('../model/usergroup')
const User = require('../model/user')
const Group = require('../model/group')


exports.getGroupName = async (req, res, next) => {

    const { groupId } = req.params

    const group = await Group.findOne({
        where: {
            id: groupId
        }
    })

    console.log("this is output", group)
    res.status(200).json(group)
}


exports.getAllGroupMembers = async (req, res, next) => {
    try {
        const { groupId } = req.params
        console.log("this is groupId", groupId)
        //finding user with same group from usergroup table
        const usergroups = await UserGroup.findAll({
            where:
                { groupId: groupId },
            attributes: ['role', 'userId'],
        })
        //getting only the userid of the members
        const userIds = usergroups.map(usergroup => usergroup.userId)
        // from User table fetching user with the above userid
        const users = await User.findAll({
            where: { id: userIds },
            attributes: ['id', 'userName', 'userEmail']
        })
        //now here combining both , and getting roles for each user
        const userDetailsWithRoles = usergroups.map(userGroup => {
            const user = users.find(u => u.id === userGroup.userId)
            return {
                userName: user.userName,
                userEmail: user.userEmail,
                role: userGroup.role,
                id: user.id
            };
        })
        res.status(200).json({userDetailsWithRoles,loggedInUserId :req.user.id})

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "error" })

    }

}

//for finding new member to join the group
exports.getNewUsersAvailable = async (req, res, next) => {

    const { groupId } = req.params
    try {
        const usersInCurrentGroup = await UserGroup.findAll({
            where: {
                groupId: groupId
            },
            attributes: ['userId']
        })


        const userIdsInGroup = usersInCurrentGroup.map(userGroup => userGroup.userId);

        const availableUsers = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: userIdsInGroup
                }
            }
        })

        res.status(200).json(availableUsers)
    }
    catch (err) {
        res.status(5000).json("error while finding available users in server")

    }
}
// this will add the clicked user to current group
exports.addNewMemberToGroup = async (req, res, next) => {
    const { groupId } = req.params
    const userId = req.body.userId

    try {
        const group = await Group.findByPk(groupId)
        const user = await User.findByPk(userId)

        if (!group || !user) {
            return res.status(404).json({ message: "User or Group Not found" })
        }
        const existingUserGroup = await UserGroup.findOne({ where: { userId: userId, groupId: groupId } })
        if (existingUserGroup) {
            return res.status(400).json({ message: "User is already a part of the group" })
        }
        await UserGroup.create({
            userId: userId,
            groupId: groupId,
            role: 'member'
        })
        res.status(200).json({ message: "User added to the group Successfully" })
    }
    catch (error) {
        console.log("Error adding user to the group", error)
        res.status(500).json({ message: "Internal surver error" })
    }

}

//promote user to admin

exports.promoteMemberToAdmin = async (req, res, next) => {
    const { groupId } = req.params
    const userId = req.body.userId



    await UserGroup.update({ role: 'Admin' }, {
        where: {
            groupId: groupId,
            userId: userId
        }
    })

    res.status(200).json({ message: "member promoted to admin successfully" })

}

exports.removeMemberFromGroup = async (req, res, next) => {
    const { groupId } = req.params
    const userId = req.body.userId

    await UserGroup.destroy({
        where: {
            userId: userId,
            groupId: groupId
        }
    })

    res.status(201).json({ message: "member successfully removed from group" })

}