const express = require('express')
const router = express.Router()

const userController=require('../controller/user')


router.get('/', userController.getRegisterForm)

router.post('/user/register',userController.postRegisterForm )

router.post('/user/login',userController.postUserLogin)


module.exports = router