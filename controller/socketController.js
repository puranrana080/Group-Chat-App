const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Message=require('../model/groupmessages')

exports.handleConnection=async(socket)=>{
    try{
        const token=socket.handshake.auth.token
        if(!token){
            console.log("no token provided")
            return socket.disconnect()
        }
        const decoded =jwt.verify(token,process.env.TOKEN_SECRET)
        const user=await User.findByPk(decoded.userId)
        if(!user){
            console.log('User not found,disconnecting')
            return socket.disconnect()
        }
        socket.user=user
        console.log(`${user.userName} connected`)


        socket.on('chat-message', async(data) => {

            try{
                const newMessage=await Message.create({
                    userId:socket.user.id,
                    groupId:data.groupId,
                    userMessage:data.message
                })
                socket.broadcast.emit('chat-message',{
                    userName: socket.user.userName,
                    userMessage: data.message,
                    groupId: data.groupId
                })
                console.log(`${socket.user.userName}: ${data.message}`);
            }
            catch(error){
                console.log("Error saving messsage to db",error)
            }
            // Handle chat message, using socket.user to get user info
            console.log(`${socket.user.userName}: ${data.message}`);
            // You can broadcast the message to other clients here
            
        });

        socket.on('disconnect', () => {
            console.log(`${socket.user.userName} disconnected`);
        });


    }
    catch (error) {
        console.log('Authentication error:', error);
        socket.disconnect(); // Disconnect on authentication failure
    }

}