import "../src/style.css"


const login = document.querySelector("#login")

login.addEventListener("click", (e) => {

 e.preventDefault();

 login.innerHTML = `<div class="h-6 w-6 animate-spin rounded-full border-4  border-t-transparent"></div>
` 
 const username = document.querySelector("#username").value;

  const password = document.querySelector("#password").value;
  
  fetch("/api/v1/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password}),
    credentials: "include"
  })
.then(res => {
  const errorBox = document.getElementById("errors")
  if (!res.ok) {
    if (res.status === 402) {
      errorBox.innerText = "Please enter required fields"
    }
    if (res.status === 404) {
      errorBox.innerText = "User not found"
    }
    if (res.status === 406) {
      errorBox.innerText = "Incorrect Password"
    }
    const err = new Error("validation Error")
     err.isValidationError = true
     throw err;
  }
  return res.json()
})
.then(data => {
  
  
  console.log(data);
  
  if (data.success) {
  
    
   window.location.href = "../index.html"
  }

}).catch(err => {
   if (!err.isValidationError) {
    document.getElementById("errors").innerHTML = "Check your Internet connection"
   }
})
.finally(() => {
 login.innerHTML = `Log In`

})

})

