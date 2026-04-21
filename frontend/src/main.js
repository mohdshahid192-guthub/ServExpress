
const user = document.querySelector("#user");

user.addEventListener("click", () => {

  fetch("/api/v1/users/check-user-login")
.then(response => {
  return response.json()
})
.then(data => {
  if (data.success) {
    window.location.href = "/structures/pHome.html"
  }
else{
  window.location.href = "/structures/login.html"
}
})

})

