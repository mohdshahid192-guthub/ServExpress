const proBtn = document.querySelector("#pro-btn");
const userBtn = document.querySelector("#user-btn");
const patchEle = document.querySelector(".patch-element");
const users = document.querySelectorAll(".users");
const professional = document.querySelectorAll(".professionals");
const note1 = document.querySelectorAll(".note1");
const note2 = document.querySelectorAll(".note2");
const parent = document.querySelectorAll(".parent-container")

proBtn.addEventListener("click", () => {
  // Professionals mode
  patchEle.classList.add("active");
  patchEle.classList.remove("deactive");

  users.forEach(user => {
    user.classList.add("active");
    user.classList.remove("deactive");
  });

  professional.forEach(pro => {
    pro.classList.add("active");
    pro.classList.remove("deactive");
  });

  note1.forEach(note => {
    note.classList.add("active");
    note.classList.remove("deactive");
  });

  note2.forEach(note => {
    note.classList.add("active");
    note.classList.remove("deactive");
     });
  parent.forEach(note => {
    note.classList.add("active");
    note.classList.remove("deactive");
  });
});

userBtn.addEventListener("click", () => {
  // Users mode
  patchEle.classList.add("deactive");
  patchEle.classList.remove("active");

  users.forEach(user => {
    user.classList.add("deactive");
    user.classList.remove("active");
  });

  professional.forEach(pro => {
    pro.classList.add("deactive");
    pro.classList.remove("active");
  });

  note1.forEach(note => {
    note.classList.add("deactive");
    note.classList.remove("active");
  });

  note2.forEach(note => {
    note.classList.add("deactive");
    note.classList.remove("active");
    });
     parent.forEach(note => {
    note.classList.add("active");
    note.classList.remove("deactive");
     });
  
});