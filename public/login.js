function loginUser(event){
    event.preventDefault()
    const loginData={
        userEmail:event.target.email.value,
        userPassword:event.target.password

    }
    axios.post("http://localhost:3000/user/login",loginData)
    .then(response=>{
        alert("User logged in Successfully")
        console.log("user logged in ")

    })
    .catch(err=>{
        console.log("User not available ",err)
    })

}