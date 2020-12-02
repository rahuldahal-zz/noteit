const heroMockupElement = document.querySelector(".hero__mockup");

export default function misc() {
  if (window.innerWidth > 768) {
    window.addEventListener("scroll", heroMockup);
  }
}

function heroMockup(e) {
  if (window.scrollY > 800) {
    heroMockupElement.style.position = "absolute";
    window.removeEventListener("scroll", heroMockup);
  }
}
