function registerUser(event){
    event.preventDefault()
    const newUser={
        userName:event.target.name.value,
        userEmail:event.target.email.value,
        userPhone:event.target.phone.value,
        password:event.target.password.value
    }

    axios.post("http://localhost:3000/user/register",newUser)
    .then(response=>{
        console.log("User Added Successfully",response.data)
        alert("Successfuly signed up")

    })
    .catch(err=>{
        console.log("Server err or user already exist",err)
        alert("User already exists, Please Login")

    })
}