
const button = document.querySelector("button");
const icon = button.querySelector(".icon");
const form = document.querySelector("form");


button.addEventListener("click", (e) => {
  e.preventDefault(); // stop immediate form submission

  // Lock hover effect + trigger animation
  button.classList.add("clicked", "hold-hover");

  // After animation ends → reset + submit form
  icon.addEventListener("animationend", () => {
    button.classList.remove("clicked", "hold-hover");
    form.submit(); // submit the form after animation
  }, { once: true });
});

