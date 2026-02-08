const signIn = document.querySelector(".sign-in");
const signUp = document.querySelector(".sign-up");

signIn.addEventListener("click", () =>{
  window.location.href = "/Login_page/login.html";
} );

signUp.addEventListener("click", () =>{
  window.location.href = "/new_user/signUp.html";
})
