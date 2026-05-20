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



async function registerUser(requiredFields) {

  const username = requiredFields.username
  const email = requiredFields.email
  const password = requiredFields.password
  const phone = requiredFields.phone
  const accountType = requiredFields.accountType
  const errorBox = requiredFields.errorBox
  return await fetch("/api/v1/users/register", {
    method: "POST",
    headers:{ "Content-Type": "application/json"},
    body: JSON.stringify({ username, email, password, phone, accountType})
  })
  .then(res =>  {
     if (!res.ok) {
      if (res.status === 402) {
     
        errorBox.innerText = "Please fill all the required fields"
      }
      if (res.status === 404) {
        errorBox.innerText = "Please enter a valid phone number"
      }
      if (res.status === 422) {
 
        errorBox.innerText = "User already exist"
      }
      if (res.status === 501) {
        errorBox.innerText = "User registration failed Try again"
      }
      const err = new Error("validation error")
      err.isvalidationError = true;
      throw err;
      
     }
   
    return res.json()
  }
  )
  .then(data => {
    if (data.success) {
      window.location.href = "./login.html"
    }
  })
  .catch(err => {

    if (!err.isvalidationError) {
     errorBox.innerText = "Please check your network connection"
      
    }
    
  })
}




const userRegister = document.querySelector("#userSignUp")
userRegister.addEventListener("submit", (e) => {
 e.preventDefault();

  const errorBox = document.getElementById("errors")
  const username = document.querySelector("#username").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const phone = document.querySelector("#phone").value;
const accountType = "customer"

const requiredFields = {username, email, password, phone, accountType, errorBox}
 registerUser(requiredFields)

})


const professionalRegister = document.querySelector("#professionalSignUp")
professionalRegister.addEventListener("submit", (e) => {
 e.preventDefault();

  const errorBox = document.getElementById("errorsProfessional")
    const username = document.querySelector("#username-professional").value;
  const email = document.querySelector("#email-professional").value;
  const password = document.querySelector("#password-professional").value;

  const phone = document.querySelector("#phone-professional").value;
  
  const accountType = "professional"
  const requiredFields = {username, email, password, phone, accountType, errorBox}
 registerUser(requiredFields)

})


