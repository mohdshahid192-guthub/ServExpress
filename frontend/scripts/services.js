import "../src/style.css"



function loadProfessionals(category, location) {
  return fetch("/api/v1/users/services-section", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({category, location})
  });
}

const container = document.querySelector("#container")

window.addEventListener("DOMContentLoaded", () => {
  const category = localStorage.getItem("selectedCategory")
  const location = localStorage.getItem("location")
  document.getElementById("category").innerText = category
  
 loadProfessionals(category, location).then(res => res.json())
 .then(data => {
   
  for(let i = 0 ; i < data.message.length; i++){

    const li = document.createElement("li")
li.classList.add("w-40")

li.innerHTML =`<div
        class="bg-white w-full h-full rounded-sm flex flex-col items-center justify-between shrink-0 hover:-translate-y-2 transition-all ">
        <img class="border-2 border-gray-900 object-cover w-3/4 h-auto mt-4 rounded-br-2xl rounded-tr-lg rounded-tl-2xl rounded-bl-lg" src="${data.message[i]?.avatar?.url}" alt="">
        <div class="flex flex-col text-center p-3 gap-2">
          <p class="font-bold text-xl">${data.message[i].fullName}</p>
          <p class="text-sm">Rs ${data.message[i]?.serviceCharge}</p>
          <p>Rating</p>
        </div>
      </div>`

 li.addEventListener("click", () => {
              localStorage.setItem("id", data.message[i]?._id)
              window.location.href = "/structures/booking.html"
  
            })

      container.appendChild(li)
  }
  
 })

})