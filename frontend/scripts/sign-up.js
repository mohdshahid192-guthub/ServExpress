import "../src/style.css"


const customerBtn = document.getElementById("custBtn");
const professionalBtn = document.getElementById("proBtn");
const customer = document.getElementById("customer");
const professional = document.getElementById("professional");

customerBtn.addEventListener("click", () => {
  customer.classList.add("opacity-100", "translate-x-0");
  customer.classList.remove("opacity-0", "-translate-x-full");

  professional.classList.add("opacity-0", "translate-x-full");
  professional.classList.remove("opacity-100", "translate-x-0");

});
proBtn.addEventListener("click", () => {
  customer.classList.add("opacity-0", "-translate-x-full");
    customer.classList.remove("opacity-100", "translate-x-0");

  professional.classList.add("opacity-100", "translate-x-0");
  professional.classList.remove("opacity-0", "translate-x-full");
});




const userRegister = document.querySelector("#userSignUp")
userRegister.addEventListener("submit", (e) => {
 e.preventDefault();

 const username = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
  const password = document.querySelector("#password").value;
  const accountType = "customer"

  fetch("/api/v1/users/register", {
    method: "POST",
    headers:{ "Content-Type": "application/json"},
    body: JSON.stringify({ username, email, password, accountType, phone})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "../login/login.html"
    }
  })
  .catch(error => {
    throw new Error("registration failed", error);
    
    
  })


})


const professionalRegister = document.querySelector("#professionalSignUp")
professionalRegister.addEventListener("submit", (e) => {
 e.preventDefault();

 const username = document.querySelector("#username-professional").value;
  const email = document.querySelector("#email-professional").value;
  const password = document.querySelector("#password-professional").value;

  const phone = parseInt(document.querySelector("#phone-professional").value);
  const accountType = "professional";


  fetch("/api/v1/users/register", {
    method: "POST",
    headers:{ "Content-Type": "application/json"},
    body: JSON.stringify({ username, email, password, phone, accountType})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "../pHome.html"
    }
  })
  .catch(error => {
    throw new Error("registration failed", error);
    
  })

})


