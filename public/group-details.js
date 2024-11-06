const groupId = new URLSearchParams(window.location.search).get('groupId')


window.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token')
    if (!token) {
        console.log('Token not found in localStorage,login First');
        return;
    }
    //getting groupName

    const group = await axios.get(`http://localhost:3000/groupdetails/${groupId}/groupName`, { headers: { "Authorization": token } })


    console.log("this is received", group)
    document.getElementById('groupName').innerHTML = `${group.data.groupName}`
    document.getElementById('createdBy').innerHTML = `<em>createdBy : </em>  ${group.data.createdBy}`




    axios.get(`http://localhost:3000/groupdetails/${groupId}/members`, { headers: { "Authorization": token } })
        .then(response => {

            const { userDetailsWithRoles, loggedInUserId } = response.data
            const loggedInUser = userDetailsWithRoles.find(member => member.id === loggedInUserId);

            const groupMemberList = document.querySelector('.group-users')


            console.log("All group  members with roles", userDetailsWithRoles)

            const isAdmin = loggedInUser && loggedInUser.role === 'Admin'


            userDetailsWithRoles.forEach(member => {
                const p = document.createElement('p')
                p.classList.add('member-item');

                let memberInfo = `${member.userName} 
                <strong>${member.userEmail} </strong>
           <span class="highlight"> ${member.role}</span>`;

                if (isAdmin && member.role !== 'Admin') {
                    memberInfo += `<div class="button-container">
            
            <button class="btn promote-btn">Make Admin</button>
            <button class="btn remove-btn">Remove</button>
        </div>`
                }

                p.innerHTML = memberInfo
                groupMemberList.appendChild(p)


                const promoteBtn = p.querySelector('.promote-btn')

                if (promoteBtn) {
                    promoteBtn.addEventListener('click', async () => {

                        await axios.post(`http://localhost:3000/groupdetails/${groupId}/promote`, { userId: member.id }, { headers: { "Authorization": token } })
                        p.querySelector('.highlight').textContent = "Admin"
                        window.location.reload()
                    })
                }

                const removeBtn = p.querySelector('.remove-btn')

                if (removeBtn) {
                    removeBtn.addEventListener('click', async () => {

                        await axios.post(`http://localhost:3000/groupdetails/${groupId}/remove`, { userId: member.id }, { headers: { "Authorization": token } })

                        p.remove()
                    })
                }
            })
        })
        .catch(err => {
            console.log("error is ", err)
        })


})

document.getElementById('addMember').addEventListener('click', async () => {
    window.location.href = `add-member.html?groupId=${groupId}`

})

goback = document.getElementById('goback')
goback.addEventListener('click', () => {
    window.location.href = '/groupchat'
})




