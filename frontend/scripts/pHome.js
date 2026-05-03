
import "../src/style.css"

 

 






const logo = document.getElementById("logo");

logo.addEventListener("click", () => {
  window.open("/home/home.html", "_self" );
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
  showSection(pending_sec)
})
history.addEventListener("click", () => {
  showSection(history_sec)
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


fetch("/api/v1/orders/pending", {credentials: "include"})
.then(res => res.json())
.then(data => {

   if (data.message.length < 1) {
    pending_sec.forEach(Element => Element.innerHTML = "No Work to do")
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
})









 


