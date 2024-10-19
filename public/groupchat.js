function sendChatToGroup(event) {
    event.preventDefault()
    const userMessage = event.target.msg.value
    console.log(userMessage)
    const token = localStorage.getItem('token')

    axios.post("http://localhost:3000/groupchat/sendChat", { message: userMessage }, { headers: { "Authorization": token } })
        .then(response => {
            console.log("single", response.data)
        })
        .catch(error => {
            console.log("server err", error)
        })

}


function displayLoggedUserOnScreen(user) {
    const userPara = document.getElementById('userLogged')

    const newpara = document.createElement('p')
    newpara.appendChild(document.createTextNode(`${user.userName} joined`))
    userPara.appendChild(newpara)
}

function displayChatOnScreen(chat) {
    const userPara = document.getElementById('chats')

    const newpara = document.createElement('p')

    const userName = chat.userName;
    const userMessage = chat.userMessage;

    newpara.appendChild(document.createTextNode(`${userName} :   ${userMessage}`))
    userPara.appendChild(newpara)
}


function getChatAndDisplay() {
    const token = localStorage.getItem('token')
    axios.get("http://localhost:3000/groupchat/groupmessages", { headers: { "Authorization": token } })
        .then(response => {

            const groupChat = response.data.allChat

            const chat = document.getElementById('chats')
            chat.innerHTML = ''

            groupChat.forEach(chat => {
                displayChatOnScreen(chat)
            })
        })
        .catch(err => {
            console.log("Nothing from server", err)
        })


}




window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token')

    if (!token) {
        console.log('Token not found in localStorage');
        return;
    }


    axios.get("http://localhost:3000/groupchat/users", { headers: { "Authorization": token } })
        .then(response => {
            console.log("server Response", response.data.allUsers)
            const loggedUser = response.data.allUsers

            loggedUser.forEach(user => {
                displayLoggedUserOnScreen(user)
                console.log("user logged", user.userName)
            })

        })
        .catch(err => {
            console.log("err, not got", err)
        })

    setInterval(() => getChatAndDisplay(), 1000)




})


