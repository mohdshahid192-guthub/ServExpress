import "../src/style.css"


 const _id = localStorage.getItem("id")

function getBookingDetails(_id) {
  return fetch("/api/v1/users/booking-datails", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({_id})
  })
}
const bookingContainer = document.querySelector("#booking-container")
getBookingDetails(_id).then(res => res.json())
.then(data => {
 const avatarSrc = data.message?.avatar?.url && data.message?.avatar?.url.trim() !== ""
       ? data.message?.avatar?.url
       : "/src/assets/img/circle-user-solid.png";


    const div = document.createElement("div")
     div.classList.add("flex", "flex-col", "items-center" ,"justify-center", "w-full", "h-max", "gap-4", "px-4", "py-12", "sm:grid", "sm:grid-cols-2", "sm:place-items-center")
      
    div.innerHTML = `<div class="flex md:justify-start w-full  justify-center md:pl-8 h-full items-center">
    <div class="w-60 h-60 rounded-sm bg-white md:place-items-stretch">
      <img class="p-2 w-full h-full object-cover bg-center bg-no-repeat" src="${avatarSrc}" alt="Professional-picture">
    </div>
    </div>
    <div class="flex flex-col justify-center items-center w-full h-max mt-4 gap-4 text-nowrap">
      <h1 class="text-4xl font-bold ">${data.message?.fullName}</h1>
      <div class="flex w-[60%] justify-evenly flex-wrap"><p class="text-xl font-light">Work Experience: </p> <p class="font-bold text-2xl">${data.message?.experience}-years</p></div>
      <div class="flex w-[60%] items-center justify-evenly"><p class="text-lg font-light">Service charge:</p><p class="text-2xl font-bold">${data.message?.serviceCharge}</p></div>
      <div class="flex justify-center gap-2 w-[70%] items-center">
        <i class="fa-solid fa-star text-3xl text-amber-400"></i>
        <i class="fa-solid fa-star text-3xl text-amber-400"></i>
        <i class="fa-solid fa-star text-3xl text-amber-400"></i>
        <i class="fa-solid fa-star text-3xl text-amber-400"></i>
        <i class="fa-regular fa-star text-3xl text-amber-400"></i>
      </div>
      <div class="mt-4 p-4 w-full flex items-center justify-center"><button class="w-3/2 rounded-sm h-12 text-black font-bold tracking-wider bg-amber-300 hover:bg-amber-500 cursor-pointer" id = "book-appointment">Book Appointment</button></div>

  </div>`
 

    bookingContainer.appendChild(div)
   
   
     const professionalId = data.message?._id

     const bookingBtn = document.getElementById("book-appointment")
     
     bookingBtn.addEventListener("click", () => {
      fetch("/api/v1/orders/order-placed", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({professionalId}),
        credentials: "include"

      }).then(res => res.json())
      .then(data => {
        if (data.success) {
          bookingBtn.innerText = "Requested"
          bookingBtn.classList.replace("bg-amber-300", "bg-white")
         
        }
        
      })
       
     })

})
.catch(error => console.log("Unable to place order", error)
)












