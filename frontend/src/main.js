import "./style.css"

function loginStatus() {
  return fetch("/api/v1/users/check-user-login")
}

const user = document.querySelectorAll("#user");

user.forEach(Element => {

  Element.addEventListener("click", () => {
  
    loginStatus()
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
})

function goToServices(section){
  localStorage.setItem("selectedCategory", section)

    window.location.href = "./structures/services.html"

}



const electricianBucket = document.querySelector("#electrician-bucket")
const plumberBucket = document.querySelector("#plumber-bucket")
const painterBucket = document.querySelector("#painter-bucket")
const carpenterBucket = document.querySelector("#carpenter-bucket")

electricianBucket.addEventListener("click", () => {
  goToServices("Electricians")
})
plumberBucket.addEventListener("click", () => {
  goToServices("Plumbers")
})
carpenterBucket.addEventListener("click", () => {
  goToServices("Carpenters")
})
painterBucket.addEventListener("click", () => {
  goToServices("Painters")
})

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
  window.open("./index.html", "_self" );
});


const renderProfessional = () => {
  return fetch("/api/v1/users/render-professional");
};

const electricianSection = document.querySelector("#electrician-section");
const plumberSection = document.querySelector("#plumber-section");
const painterSection = document.querySelector("#painter-section");
const carpenterSection = document.querySelector("#carpenter-section");
const logoutUser = document.querySelector("#logOut")
const logINUser = document.querySelector("#logIn")
// Attach to window, not div
window.addEventListener("DOMContentLoaded", () => {
 

  renderProfessional()
    .then(res => res.json())
    .then(data => {
      
        for (let i = 0; i < data.message.length; i++) {
        
          if (data.message[i]) {
            const div = document.createElement("div");
            div.classList.add(
              "bg-white", "w-40", "h-max", "rounded-4xl", "flex",
              "justify-center", "flex-col", "items-center", "shrink-0",
              "hover:-translate-y-2", "transition-all"
            );
             
            div.innerHTML = `
              <img class="object-cover h-3/4 w-full" src=" ${data.message[i]?.avatar}" alt="">
              <div class="flex flex-col text-center my-3">
                <p class="font-bold text-xl">${data.message[i]?.fullName}</p>
                <p class="text-sm">Rs 300 - 400</p>
                <p>Rating</p>
              </div>
            `;
           
            div.addEventListener("click", () => {
              localStorage.setItem("id", data.message[i]?._id)
              window.location.href = "/structures/booking.html"
  
            })
    
           if (data.message[i].category === "electrician") {
             
            for (let index = 0; index < 10; index++) {
              
               electricianSection.appendChild(div);
            }
           }

           if (data.message[i].category === "painter") {
           for (let index = 0; index < 10; index++) {
            
             painterSection.appendChild(div)
           }
           }
           if (data.message[i].category === "plumber") {
            for (let index = 0; index < 10; index++) {
              
              plumberSection.appendChild(div)
            }
           }
           if (data.message[i].category === "carpenter") {
            for (let index = 0; index < 10; index++) {
              
              carpenterSection.appendChild(div)
            }
           }

           
    
         
        }else{
          return
        }
        }
        
    })
    .catch(err => console.error("Error fetching professionals:", err));


    loginStatus().then(res => res.json()).then(data => {
      if (data.success) {
        logINUser.classList.add("hidden")
        logoutUser.classList.remove("hidden")
      }else{
         logINUser.classList.remove("hidden")
        logoutUser.classList.add("hidden")
      }
    })
});


async function logOutUser() {
  try {
    const res = await fetch("/api/v1/users/logout", {
      method: "POST",
      credentials: "include" // ✅ ensures cookies are sent
    });

    const data = await res.json();

    if (data.message === "User Logged Out") {
      // Clear client-side storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear non-HttpOnly cookies (if any)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

     window.location.replace("/index.html");

    }
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

logoutUser.addEventListener("click", () => {
     logOutUser()
      
});

