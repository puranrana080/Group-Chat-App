function sendChatToGroup(event) {
    event.preventDefault()
    const userMessage = event.target.msg.value
    console.log(userMessage)
    const token = localStorage.getItem('token')

    axios.post("http://localhost:3000/groupchat/sendChat", { message: userMessage }, { headers: { "Authorization": token } })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log("server err", error)
        })

}





function displayLoggedUserOnScreen(user) {
    const userPara = document.getElementById('chats')

    const newpara = document.createElement('p')
    newpara.appendChild(document.createTextNode(`${user.userName} joined`))
    userPara.appendChild(newpara)
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

})


