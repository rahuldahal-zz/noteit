const heroMockupWrap = document.querySelector(".hero__mockupWrap");
const heroElement = document.querySelector(".hero");
const infoElement = document.querySelector(".info");

export default class GuestScreen {
  constructor() {
    if (window.innerWidth > 1200) {
      this.infoBoundingRectBottom = infoElement.getBoundingClientRect().bottom;
      this.mockupBoundingRectBottom = heroMockupWrap.getBoundingClientRect().bottom;
      this.tenViewport = this.getVH(10);
      this.intersection([0.75]).observe(heroElement);
      this.intersection([0.25]).observe(infoElement);
    }
  }

  // events
  events() {}

  // methods

  intersection(threshold) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log(entry);
          switch (entry.target) {
            case infoElement:
              this.onInfoIntersection(entry);
              break;
            case heroElement:
              this.onHeroIntersection(entry);
              break;
          }
        });
      },
      {
        root: null,
        threshold,
      }
    );
  }

  onInfoIntersection({
    boundingClientRect,
    intersectionRatio,
    isIntersecting,
  }) {
    if (isIntersecting) {
      heroMockupWrap.style.transform = `translateY(${
        this.infoBoundingRectBottom -
        this.mockupBoundingRectBottom -
        this.tenViewport
      }px) scale(0.75)`;
    }
  }

  onHeroIntersection({
    boundingClientRect,
    intersectionRatio,
    isIntersecting,
  }) {
    if (isIntersecting) {
      heroMockupWrap.style.transform = `scale(1) translateY(0px)`;
    }
  }

  getVH(v) {
    let h = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    return (v * h) / 100;
  }
}
