
import "../src/style.css"

function setPopUp (message){
  
  const popUpContainer = document.getElementById("pop-up-container")
  const messageContainer = document.getElementById("message-container")
  popUpContainer.classList.replace("hidden", "flex")
  messageContainer.innerHTML = message
  setTimeout(() => {
   popUpContainer.classList.replace("flex", "hidden")
   messageContainer.innerHTML = ``
  }, 1500)
}



const logo = document.getElementById("logo");

logo.addEventListener("click", () => {
  window.open("../index.html", "_self" );
});


const requests = document.getElementById("requests")
const pendings = document.getElementById("pendings")
const history = document.getElementById("history")
const request_sec = document.querySelectorAll("#request_section")
const pending_sec = document.querySelectorAll("#pending_section")
const history_sec = document.querySelectorAll("#history_section")


// requests.addEventListener("click", () => {
// request_sec.classList.remove("hidden")
// request_sec.classList.add("flex")

// pending_sec.classList.remove("flex")
// pending_sec.classList.add("hidden")

// history_sec.classList.add("hidden")
// history_sec.classList.remove("flex")

// })

// pendings.addEventListener("click", () => {


//     request_sec.classList.remove("flex")
// request_sec.classList.add("hidden")

//   pending_sec.classList.remove("hidden")
//   pending_sec.classList.add("flex")


// history_sec.classList.remove("flex")
// history_sec.classList.add("hidden")

// })

// history.addEventListener("click", () => {


// request_sec.classList.remove("flex")
// request_sec.classList.add("hidden")

//   pending_sec.classList.remove("flex")
//   pending_sec.classList.add("hidden")


// history_sec.classList.remove("hidden")
// history_sec.classList.add("flex")

// })
const sections = [request_sec, pending_sec, history_sec];

function showSection(visible){
sections.forEach(sec => {
sec.forEach(Element => {
Element.classList.remove("flex");
Element.classList.add("hidden");
});
});

visible.forEach(Element => {
Element.classList.remove("hidden");
Element.classList.add("flex");
});

requests.classList.remove("bg-gray-400")

}

requests.addEventListener("click", () => {
  showSection(request_sec);
  
})
pendings.addEventListener("click", () => {
  showSection(pending_sec);


  fetch("/api/v1/orders/pending", {credentials: "include"})
.then(res => {
  if (!res.ok) {
    if (res.status === 404) {
       pending_sec.forEach(Element => Element.innerHTML = "No Work to do")
    }
    if (res.status === 406) {
      const message = `<span>&#x274C;</span><p>Incorrect OTP</p>`
       setPopUp(message)
    }
  }
  return res.json()
})
.then(data => {
 pending_sec.forEach(Element => Element.innerHTML = "");
  
 if (data.message.length < 1) {
 pending_sec.forEach(Element => Element.innerHTML = "No pending work");
  
 }
  
    for(let i = 0; i < data.message.length; i++){
      const div = document.createElement("div")
      div.classList.add("bg-slate-700", "w-[90%]", "h-max", "flex", "items-start", "rounded-4xl", "px-8", "py-4", "flex-col")
      div.innerHTML = `<p class="font-bold text-3xl capitalize text-white">${data.message[i]?.customerDetails?.username}</p>
<p class=" capitalize text-white">user address comes here</p>
<p class="font-bold capitalize text-white">+91-${data.message[i]?.customerDetails?.phone}</p>`

div.addEventListener("click", () => {

 if (document.getElementById("otp-section")) {
  return
 }

  const otpSection = document.createElement("form")

   otpSection.id = "otp-section";
  otpSection.classList.add("w-full", "flex", "gap-2", "justify-start", "items-center", "pt-4")

  otpSection.innerHTML = ` <label class="font-semibold text-white " for="otp">OTP: </label>
  <input class="border-b-2 border-white outline-0 caret-white text-white" type="text" id="otp">
  <button class="rounded-full w-20 h-12 border-2 border-white text-white capitalize font-bold hover:bg-white hover:text-black cursor-pointer" id="Otp-submit">Submit</button>`

  
  const status = "served";
  const orderId = data.message[i]?._id

  otpSection.addEventListener("submit", (e) => {
    e.preventDefault()
    const otp = otpSection.querySelector("#otp").value;
 fetch("/api/v1/orders/pending-to-served", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({otp, status, orderId})
  }).then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.reload()
    }
    
  })

  })
 

  div.appendChild(otpSection)
})

pending_sec.forEach(Element => Element.appendChild(div))
    }
});

});


history.addEventListener("click", () => {
  showSection(history_sec)

  fetch("/api/v1/orders/history", {credentials: "include"})
.then(res => res.json())
.then(data => {
 history_sec.forEach(Element => Element.innerHTML = "")

 if (data.message.length <1 ) {
    history_sec.forEach(Element => Element.innerText = "No work History")
 }
  for(let i = 0; i < data.message.length; i++){
  const div = document.createElement("div")

  div.classList.add("bg-green-500" , "w-[90%]", "h-max", "flex" ,"items-start", "rounded-4xl", "px-8", "py-4", "flex-col")

  

div.innerHTML = `<p class="font-bold text-3xl capitalize ">${data.message[i].customerDetails?.username}</p>
<p class="font-bold capitalize">Service Status: ${data.message[i]?.status}</p>
<p class=" font-bold">OrderId: ${data.message[i]?._id} </p>
`
if (data.message[i].status === "missed") {
    div.classList.replace("bg-green-500", "bg-red-500")
    div.classList.add("text-gray-200")
  }
history_sec.forEach(Element => Element.appendChild(div))
  }


})
.catch(error => console.log("cannot fetch history data", error)
)
})

window.addEventListener("load",() => {
  sections.forEach(sec => {
sec.forEach(Element => {
Element.classList.remove("flex");
Element.classList.add("hidden");
});
});

request_sec.forEach(Element => {
Element.classList.add("flex");
Element.classList.remove("hidden")
})
requests.classList.add("bg-gray-400")
})

const editForm = document.querySelector("#edit-form");
const modal = document.querySelector("#modal");
const avatarPreview = document.querySelector("#avatarPreview");

const profileContainer = document.querySelector("#profile-container");
 fetch("/api/v1/users/profile-details", {credentials: "include"})
 .then(res => res.json())
 .then(data => {

   
   if (data.success)   {
    const user = data.message[0]
   const avatarSrc = user.avatar?.url && user.avatar?.url.trim() !== ""
       ? user.avatar?.url
       : "/src/assets/img/circle-user-solid.png";
      const div = document.createElement("div")
    div.classList.add("grid", "gap-8", "w-full", "place-items-center", "md:grid-cols-2")

    div.innerHTML =` <div class="border-2 border-white rounded-full" id = "avatar"><img class="h-48 w-48 object-cover bg-white rounded-full" src="${avatarSrc}" alt="">
  </div>
 
<div class="flex flex-col w-full h-full items-center justify-center gap-8 text-center md:items-start ">
  <h1 class="text-4xl font-bold text-white w-full md:text-center md:pr-8">${user?.fullName}</h1>

   <div class="flex flex-col items-center p-4 justify-evenly rounded-4xl w-[90%] h-full bg-white  ">

    

   <div class="w-4/5 overflow-hidden text-nowrap text-2xl">
     <p class="flex gap-2 font-semibold">Email: <span class="text-gray-700">${user?.email}</span></p>
   </div>
   <div class="w-4/5 overflow-hidden text-nowrap text-2xl ">
    <p class="flex gap-2 font-semibold">Username: <span class="text-gray-700">${user?.username}</span></p>
   </div>
   <div class="w-4/5 overflow-hidden text-nowrap text-2xl ">
    <p class="flex gap-2 font-semibold">Category: <span class="text-gray-700 capitalize">${user?.category}</span></p>
   </div>
   <div class="w-4/5 overflow-hidden text-nowrap text-2xl ">
    <p class="flex gap-2 font-semibold" id = "experience">Experience: <span class="text-gray-700" >${user?.experience}</span></p>
   </div>
   <div class="w-4/5 overflow-hidden text-nowrap text-2xl ">
    <p class="flex gap-2 font-semibold">Phone: <span class="text-gray-700">+91 ${user?.phone}</span></p>
   </div>
   <div class="w-4/5 overflow-hidden text-nowrap text-2xl ">
    <p class="flex gap-2 font-semibold" id = "serviceCharge">Service Charge: <span class="text-gray-700" >${user?.serviceCharge}</span></p>
   </div>
   <div class="w-4/5  overflow-hidden text-nowrap text-2xl ">
    <p class="flex gap-2 font-semibold">Location: <span class="text-gray-700">${user?.location}</span></p>
   </div>
   <button class="pt-8 hover:underline cursor-pointer font-semibold capitalize" id="edit">Edit details</button>
 </div>
  </div>`

  if (user?.accountType === "customer") {
    document.getElementById("forProfessionalOnly").remove()
    document.getElementById("experienceEdit").remove()
    document.getElementById("serviceEdit").remove()
    document.getElementById("categoryEdit").remove()
  
    div.querySelector("#experience").remove()
    div.querySelector("#serviceCharge").remove()
    
  }

 document.querySelector("#emailEdit").setAttribute("placeholder", user?.email)
 document.querySelector("#username").setAttribute("placeholder", user?.username)

  div.querySelector("#edit").addEventListener("click", (e) => {
      e.preventDefault()
    editForm.classList.remove("hidden")
    editForm.classList.add("flex")
  })

  div.querySelector("#avatar").addEventListener("click", () => {
      avatarPreview.src = avatarSrc
      modal.classList.remove("hidden")
      modal.classList.add("flex")

  })
 
  profileContainer.appendChild(div)
  
}

  
 })
 .catch(error => console.log("cannot load user profile", error)
 );


 document.querySelector("#close-modal").addEventListener("click", () => {
  modal.classList.remove("flex")
  modal.classList.add("hidden")
 })

 const avatarUpload = document.querySelector("#avatarUpload")

 avatarUpload.addEventListener("change", async (e) => {
  const file = e.target.files[0]
  if (!file) {
    return
  }

  const formData = new FormData()

  formData.append("avatar", file)
  
  
  try {
    const res = await fetch("/api/v1/users/updateAvatar", {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const result = await res.json();

    if (result.success) {
      
      window.location.reload()

    }

    // Optionally update avatar immediately
    avatarImg.src = URL.createObjectURL(file);
  } catch (err) {
    console.error("Upload failed:", err);
  }
 })



fetch("/api/v1/orders/requests", {credentials: "include"})
.then(res => res.json())
.then(data => {

  if (data.message.length < 1) {
    request_sec.forEach(Element => Element.innerHTML = "No requests to show")
  }

for (let index = 0; index < data.message.length; index++) {
  
  const div = document.createElement("div")
  div.classList.add("bg-slate-700", "w-[90%]", "h-max", "flex", "items-center" , "justify-between", "rounded-4xl", "px-8", "flex-col", "sm:flex-row")
  
  div.innerHTML = `
  <p class="font-bold text-3xl capitalize text-white pt-4 sm:pt-0">
    ${data.message[index]?.customerDetails?.username}
  </p>
  <div class="flex gap-4 py-4">
    <button class=" w-15 rounded-3xl hover:bg-green-700 h-10 bg-green-500 font-bold border-2" id = "accept-btn">&#10003;</button>
    <button class=" w-15 rounded-3xl hover:bg-red-700 h-10 bg-red-500 font-bold border-2" id = "reject-btn">&#x2715;</button>
  </div>
`;


div.querySelector("#accept-btn").addEventListener("click", () => {

  const orderId = data.message[index]?._id
  const status = "pending"
  fetch("/api/v1/orders/changeStatus", {
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({orderId, status})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("Success");
      window.location.reload()
    }
  })
  
})


div.querySelector("#reject-btn").addEventListener("click", () => {

  const orderId = data.message[index]?._id
  const status = "rejected"
  fetch("/api/v1/orders/changeStatus", {
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({orderId, status})
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("Rejected");
      window.location.reload()
    }
  })
  
})


 request_sec.forEach(Element => {
    Element.appendChild(div)
  })

}

}).catch(error => console.log("Unable to fetch requests")
)







document.getElementById("closeEditForm").addEventListener("click", () => {
  editForm.classList.remove("flex")
  editForm.classList.add("hidden")
})


const saveEditForm = document.getElementById("save-edit");
saveEditForm.addEventListener("click", (e) => {
  e.preventDefault();
  const experience = document.querySelector("#experience")?.value || ""
  const serviceCharge = document.querySelector("#serviceCharge")?.value || ""

  const fullName = document.querySelector("#fullName").value;
  const phone = document.querySelector("#phone").value;
 
  const cityValue = document.querySelector("#selectCity").value;
  const category = document.querySelector("#category").value;
 
  

  fetch("/api/v1/users/edit-profile", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({fullName, experience, phone, serviceCharge, cityValue, category}),
    credentials: "include"
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("succefully Updated");
      window.location.reload()
    }
  })
  .catch(error => console.log("error occured during saving", error)
  )

 
  
  
})