const clipReferencePath = document.querySelector("#guestScreenMask>path");

export default function misc() {
  if (window.innerWidth < 768) {
    clipReferencePath.setAttribute(
      "d",
      `      
            M 0 0
            H 540
            V 720
            C 
              540 963
              540 648
              0 900
            V 0
          `
    );
  }
}
