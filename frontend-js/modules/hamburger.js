const hamBurger = document.querySelector(".nav__hamBurger");
const navLinks = document.querySelector(".nav__links");

export default function () {
  hamBurger.addEventListener("click", () => {
    hamBurger.classList.toggle("nav__hamBurger--active");
    navLinks.classList.toggle("nav__links--active");
  });
}
