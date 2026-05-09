import "../src/style.css"
const orderContainer = document.querySelector("#orderContainer");
function getOrderDetails() {
  return fetch("/api/v1/orders/order-datails",{
    credentials: "include"
  })
}

getOrderDetails()
.then(res => res.json())
.then(data => {
  
  if (data.success) {
    for (let i = 0; i < data.message.length; i++) {
     const div = document.createElement("div")
    const professional = data.message[i]?.professionalDetails
     const order = data.message[i]

     div.className =   "flex gap-4 border-2 w-[95%] h-max rounded-lg items-center justify-between p-2 flex-wrap capitalize border-yellow-600"
      
     div.innerHTML = `
      <div class="flex w-[95%] h-max items-center justify-between p-2 flex-wrap"> 
      <p class="font-bold text-2xl">${professional?.fullName}</p>
     
      <p class="font-semibold text-yellow-600" id ="status">${order?.status}</p>
    </div>

     <div class="hidden flex-col sm:flex-row gap-4 w-[95%] h-max items-center justify-center" id ="forPendingOnly">
       <div class="w-max h-max sm:w-1/2 grid place-items-center">
        <img class="w-30 border-2 h-30 object-cover" src="${professional?.avatar?.url}" alt="">
       </div>
      

     <div class="flex w-[95%] h-max flex-col justify-center sm:w-1/2"> 
      <p class="font-semibold capitalize">Service Charge: <span class="text-gray-600">${professional?.serviceCharge}</span></p>
      <p class="font-semibold">category: <span class="text-gray-600">${professional?.category}</span></p>
      <p class="font-semibold capitalize">phone: <span class="text-gray-600">${professional?.phone}</span></p>
      <p class="font-semibold capitalize">city: <span class="text-gray-600 capitalize">${professional?.location}</span></p>
      <p class="font-semibold">OTP: <span class="text-gray-600 font-bold">${order?.otp}</span></p>
    </div>



 `
  const forPending = div.querySelector("#forPendingOnly");

     if (order?.status === "pending") {
      div.addEventListener("click", () => {
      

       forPending.classList.remove("hidden")
       forPending.classList.add("flex")
     
      })

       div.querySelector("#status").classList.replace("text-yellow-600", "text-green-600")
       div.classList.replace("border-yellow-600", "border-green-600")

     }

     if (order?.status === "rejected" || order?.status === "missed") {
       div.querySelector("#status").classList.replace("text-yellow-600", "text-red-600")
       div.classList.replace("border-yellow-600", "border-red-600")
     }

     document.addEventListener("click", (e) => {
      const insideDiv = div.contains(e.target)
      if (!insideDiv && !forPending.classList.contains("hidden")) {
        forPending.classList.remove("flex")
        forPending.classList.add("hidden")
      }
     
     })

     orderContainer.appendChild(div)
    }
  }
  
})
