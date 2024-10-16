const express = require('express')
const router = express.Router()
const path=require('path')

router.get('/groupchat',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../public/groupchat.html'))


})



module.exports =router