

const menu = document.getElementById("menu");
const sidebar = document.querySelector("#sidebar");
const body = document.querySelectorAll("body");


 menu.addEventListener("click", () => {
    sidebar.classList.toggle("opacity-0");
  sidebar.classList.toggle("translate-x-full");
  sidebar.classList.toggle("pointer-events-none");
  
    body.forEach(Element => {
      Element.classList.toggle("overflow-y-hidden");
      Element.classList.toggle("overflow-y-auto");
     
    });
    menuIcon()
  
});

document.addEventListener("click", (event) => {
  const isInsideSidebar = sidebar.contains(event.target);
  const isMenuClick = menu.contains(event.target);

  if(!isInsideSidebar && !isMenuClick && !sidebar.classList.contains("opacity-0")){
    sidebar.classList.add("opacity-0", "translate-x-full", "pointer-events-none");
     body.forEach(Element => {
      Element.classList.remove("overflow-y-hidden");
      Element.classList.add("overflow-y-auto");
    });
    menuIcon()
  }
})




function menuIcon() {
  // Get the actual text content (rendered character)
  let menuText = menu.innerText.trim();

  if (menuText === "≡") {
    menu.innerText = "×";  // Unicode multiplication sign
  } else {
    menu.innerText = "≡";  // Hamburger symbol
  }
}




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





 
 


