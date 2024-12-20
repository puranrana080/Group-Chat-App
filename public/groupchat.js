
const token = localStorage.getItem('token')
const socket = io('http://localhost:3001', {
    auth: { token }
})



let currentGroupId = null
joinGroup(null)
//saving msg in db
async function sendChatToGroup(event) {
    event.preventDefault()
    const userMessage = event.target.msg.value
    const token = localStorage.getItem('token')
    const imageFile = event.target.image.files[0];

    let imageUrl = null

    if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        console.log("this is from data", formData)
        try {



            const response = await axios.post("http://localhost:3000/groupchat/uploadImageToS3", formData, { headers: { "Authorization": token } })

            console.log("Image uploaded successfully", response)
            imageUrl = response.data.fileURL
        }
        catch (error) {
            console.log("Error uploading image to server", error)
            alert("Failed to upload image. Try again.");
            return;
        }

    }
    socket.emit('chat-message', { message: userMessage, groupId: currentGroupId, imageUrl }, currentGroupId)
    const chatDisplay = document.getElementById('chats');
    const newpara = document.createElement('p');
    if (imageUrl) {
        newpara.innerHTML = `You:${userMessage} <br><img src="${imageUrl}" alt="image uploaded" style="max-width:200px">`
    }
    else {
        newpara.appendChild(document.createTextNode(`You: ${userMessage}`));
    }
    chatDisplay.appendChild(newpara);
    event.target.reset()

}
socket.on('chat-message', (chat) => {
    displayRealTimeChatOnScreen(chat)
})




function displayRealTimeChatOnScreen(chat) {
    const userPara = document.getElementById('chats')

    const newpara = document.createElement('p')

    const userName = chat.userName;
    const userMessage = chat.userMessage;
    const userImage = chat.imageUrl
    if (userImage) {
        newpara.innerHTML = `You:${userMessage} <br><img src="${userImage}" alt="image uploaded" style="max-width:200px">`
    }
    else {
        newpara.appendChild(document.createTextNode(`${userName} :  ${userMessage}`))
    }
    userPara.appendChild(newpara)

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
    const userEmail = chat.userEmail
    const image = chat.image

    if (userEmail) {

        const loggedInUserEmail = localStorage.getItem('userEmail');
        const displayName = (userEmail === loggedInUserEmail) ? 'You' : userName
        if (image) {
            newpara.innerHTML = `${displayName}:${userMessage} <br><img src="${image}" alt="image uploaded" style="max-width:200px">`


        } else {
            newpara.appendChild(document.createTextNode(`${displayName} :   ${userMessage}`))
        }
    }
    else {
        newpara.appendChild(document.createTextNode(`${userName} :  ${userMessage}`))
    }
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


    // setInterval(() => getChatAndDisplay(), 1000)
    getChatAndDisplay()

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
        //socket room join
        joinGroup(item.id)


        getChatAndDisplay()
    })



    groupItem.appendChild(document.createTextNode(`${groupName}`))
    groupLists.appendChild(groupItem)

}
function joinGroup(groupId) {
    socket.emit('join-group', groupId);

    // Set the current group ID to keep track of which group the user is in
    currentGroupId = groupId;

    console.log(`Joined group ${groupId}`);

}

document.getElementById('noGroupChat').addEventListener('click', () => {
    currentGroupId = null
    document.getElementById('groupName').innerHTML = 'Chat with everyone'
    joinGroup(null)
    getChatAndDisplay()

})


//on selection of image
const fileInput = document.getElementById('file-upload')
const uploadIconContainer = document.getElementById('upload-icon-container')

fileInput.addEventListener('change', function () {
    const file = this.files[0]

    if (file) {
        console.log('Selected file:', file.name);  // Log file name
        console.log('File type:', file.type);      // Log MIME type
    }

    if (file && file.type.startsWith('image/')) {
        uploadIconContainer.innerHTML =
            `
       <svg class="upload-icon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(37,173,85,1)"><path d="M3 19H21V21H3V19ZM13 5.82843V17H11V5.82843L4.92893 11.8995L3.51472 10.4853L12 2L20.4853 10.4853L19.0711 11.8995L13 5.82843Z"></path></svg>
       `
    }
})
