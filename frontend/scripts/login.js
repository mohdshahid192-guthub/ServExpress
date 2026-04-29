const login = document.querySelector("#login")

login.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;

  const password = document.querySelector("#password").value;
  

  fetch("/api/v1/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password}),
    credentials: "include"
  })
.then(res => res.json())
.then(data => {
  
  
  
  if (data.success) {
   if (data.user?.loggedInUser?.accountType === "customer") {
     window.location.href = "../index.html"
   }
    else{
       window.location.href = "./pHome.html"
    }
  }
})

})

