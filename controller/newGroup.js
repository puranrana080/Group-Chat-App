const Group = require('../model/group')
const UserGroup = require('../model/usergroup')

exports.createNewGroup = async (req, res, next) => {

    try {
        const { name } = req.body
        const newGroup = await Group.create({
            groupName: name,
            createdBy: req.user.userEmail
        })
        // updating usergroup table
        await UserGroup.create({
            userId: req.user.id,
            groupId: newGroup.id
        })


        res.status(201).json(newGroup)
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create group" })

    }

}

exports.getUserAllGroups = async (req, res, next) => {
    try{
    const allUserGroups= await Group.findAll({where:{
        createdBy:req.user.userEmail
    }})
    res.status(200).json({groups:allUserGroups})
    }
    catch(error){
        res.status(500).json({message:"error in finding group"})
    }




}