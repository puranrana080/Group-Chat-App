function loginUser(event){
    event.preventDefault()
    const loginData={
        userEmail:event.target.email.value,
        userPassword:event.target.password.value

    }
    axios.post("http://localhost:3000/user/login",loginData)
    .then(response=>{
        alert("User logged in Successfully")
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('userEmail',loginData.userEmail)
        console.log("user logged in successful",response.data.message)
        window.location.href='/groupchat'

    })
    .catch(err=>{
        console.log("User not available ",err)
        alert('Username or password incorrect')
    })

}