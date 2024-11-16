const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Message = require('../model/groupmessages')

exports.handleConnection = async (socket) => {
    try {
        const token = socket.handshake.auth.token
        if (!token) {
            console.log("no token provided")
            return socket.disconnect()
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findByPk(decoded.userId)
        if (!user) {
            console.log('User not found,disconnecting')
            return socket.disconnect()
        }
        socket.user = user
        console.log(`${user.userName} connected`)

        socket.on('join-group', (groupId) => {
            // socket.join(groupId);  // The user joins the group (room)
            // console.log(`${socket.user.userName} joined group ${groupId}`);
            if (groupId === null) {

                socket.join('null-group');
                console.log(`${socket.user.userName} joined the null group chat`);
            } else {

                socket.join(groupId);
                console.log(`${socket.user.userName} joined group ${groupId}`);
            }


        });


        socket.on('chat-message', async (data, groupId) => {

            try {
                const groupToUse = data.groupId || null


                const newMessage = await Message.create({
                    userId: socket.user.id,
                    groupId: groupToUse,
                    userMessage: data.message,
                    imageUrl: data.imageUrl
                })

                if (groupId === null) {
                    // Emit message to all users in the 'null-group' 
                    socket.to('null-group').emit('chat-message', {
                        userName: socket.user.userName,
                        userMessage: data.message,
                        imageUrl: data.imageUrl

                    });
                } else {
                    // Emit message to the specific group
                    socket.to(groupId).emit('chat-message', {
                        userName: socket.user.userName,
                        userMessage: data.message,
                        groupId: data.groupId,
                        imageUrl: data.imageUrl
                    });
                }
                console.log(`${socket.user.userName}: ${data.message} with ${data.imageUrl}`);
            }
            catch (error) {
                console.log("Error saving messsage to db", error)
            }

            console.log(`${socket.user.userName}: ${data.message}`);


        });

        socket.on('disconnect', () => {
            console.log(`${socket.user.userName} disconnected`);
        });


    }
    catch (error) {
        console.log('Authentication error:', error);
        socket.disconnect();
    }

}