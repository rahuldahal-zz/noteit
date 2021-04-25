import ReactGA from "react-ga";

export default function useAnalytics() {
  function sendEvent({ category, action, callback = () => {} }) {
    if (window.location.hostname !== "localhost") {
      ReactGA.event({
        category,
        action,
      });
    }
    callback();
    console.log(`sent ${action}`);
  }

  return [sendEvent];
}
