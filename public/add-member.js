const urlParams = new URLSearchParams(window.location.search)
const groupId = urlParams.get('groupId')


window.addEventListener("DOMContentLoaded", async () => {
    const groupId = new URLSearchParams(window.location.search).get('groupId')
    const token = localStorage.getItem('token')

    try {
        const response = await axios.get(`http://localhost:3000/groupdetails/${groupId}/available-users`, {
            headers: { "Authorization": token }
        })
        const allUsers = response.data
        console.log(allUsers)
        displayUsers(allUsers)



        const searchBox = document.getElementById('searchBox')

        searchBox.addEventListener('keyup', (event) => {
            const searchWord = event.target.value.toLowerCase()
            const filteredUsers = allUsers.filter(user => user.userName.toLowerCase().includes(searchWord) ||
                user.userEmail.toLowerCase().includes(searchWord))
            displayUsers(filteredUsers)
        })

        function displayUsers(users) {
            const userList = document.querySelector('.listOfUser ol')
            if (users.length <= 0) {
                userList.innerHTML = "No member available to add"
            }

            else {
                userList.innerHTML = ''
                users.forEach(user => {
                    const li = document.createElement('li')
                    li.textContent = user.userName + "  " + user.userEmail

                    li.addEventListener('click', async () => {
                        await axios.post(`http://localhost:3000/groupdetails/${groupId}/add-member`, { userId: user.id }, {
                            headers: { "Authorization": token }
                        })
                        li.remove()
                    })
                    userList.appendChild(li)
                })


            }








        }
    }
    catch (error) {
        console.log("error fetching users", error)
    }
})

const goback = document.getElementById('goback')

goback.addEventListener('click', () => {
    window.location.href = `/group-details.html?groupId=${groupId}`
})

