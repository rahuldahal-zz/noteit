export default function isScreenLargerThan(size) {
  const mediaquery = `(min-width: ${size}px)`;
  return window.matchMedia(mediaquery).matches;
}
