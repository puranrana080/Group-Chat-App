let currentGroupId = null
//saving msg in db
function sendChatToGroup(event) {
    event.preventDefault()
    const userMessage = event.target.msg.value
    console.log(userMessage)
    const token = localStorage.getItem('token')

    axios.post("http://localhost:3000/groupchat/sendChat", { message: userMessage, groupId: currentGroupId }, { headers: { "Authorization": token } })
        .then(response => {
            console.log("single", response.data)
            event.target.reset()

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
    const localStorageGroupChat = JSON.parse(localStorage.getItem(`groupMsg_${currentGroupId}`))
    let lastMsgId;
    if (localStorageGroupChat && localStorageGroupChat.length > 0) {
        lastMsgId = localStorageGroupChat[localStorageGroupChat.length - 1].msgId
    }
    else {
        lastMsgId = 0
    }


    axios.get(`http://localhost:3000/groupchat/groupmessages?groupId=${currentGroupId}&msgId=${lastMsgId}`, { headers: { "Authorization": token } })
        .then(response => {

            const groupChat = response.data.allChat
            const allUsers = response.data.allUsers

            document.getElementById('userLogged').innerHTML = ''
            allUsers.forEach(user => {
                displayLoggedUserOnScreen(user)
                console.log("user logged", user.userName)
            })


            console.log("New Message", groupChat)
            const mergedMessages = (localStorageGroupChat || []).concat(groupChat)
            while (mergedMessages.length > 10) {
                mergedMessages.shift()
            }

            localStorage.setItem(`groupMsg_${currentGroupId}`, JSON.stringify(mergedMessages))

            const chat = document.getElementById('chats')
            chat.innerHTML = ''

            mergedMessages.forEach(chat => {
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

    setInterval(() => getChatAndDisplay(), 1000)
    // getChatAndDisplay()

    getUserAllGroup()
    document.getElementById('groupName').innerHTML = 'Chat with everyone'

})
////Creating Group
document.getElementById('createGroupBtn')
    .addEventListener('click', function () {
        const groupName = prompt("Enter the name of the group")
        if (groupName) {
            createGroup(groupName)
        }
    })

function createGroup(groupName) {
    const token = localStorage.getItem('token')
    axios.post("http://localhost:3000/grouplist/create-group", { name: groupName }, { headers: { "Authorization": token } })
        .then(response => {

            displayUserGroups(response.data)
            alert("Group created ")

        })
        .catch(err => {
            console.log("err in creating group ", err)
            alert("not created group")
        })

}



function getUserAllGroup() {
    const token = localStorage.getItem('token')

    axios.get("http://localhost:3000/grouplist/user-allgroup", { headers: { "Authorization": token } })
        .then(response => {
            console.log("ggggggggggggg", response.data.groups)
            const userAllGroups = response.data.groups
            console.log("allllll", userAllGroups)
            userAllGroups.forEach(item => {
                console.log("ittttttttttttt", item)
                displayUserGroups(item)
            })

        })
        .catch(err => {
            console.log("user all group err", err)
        })

}

function displayUserGroups(item) {
    const groupLists = document.getElementById('userGroups')
    const groupItem = document.createElement('li')

    const groupName = item.groupName

    groupItem.addEventListener('click', () => {
        currentGroupId = item.id
        const currentGroup = document.getElementById('groupName')
        currentGroup.innerHTML = `  ${item.groupName}`

        const infoBtn = document.createElement('button')
        infoBtn.textContent = 'tap here for group info'

        infoBtn.className = 'btn btn-info btn-sm'
        infoBtn.setAttribute('type', 'button');

        currentGroup.appendChild(infoBtn)

        infoBtn.addEventListener('click', () => {
            window.location.href = `group-details.html?groupId=${item.id}`



        })


        getChatAndDisplay()
    })



    groupItem.appendChild(document.createTextNode(`${groupName}`))
    groupLists.appendChild(groupItem)

}

document.getElementById('noGroupChat').addEventListener('click', () => {
    currentGroupId = null
    document.getElementById('groupName').innerHTML = 'Chat with everyone'

})

