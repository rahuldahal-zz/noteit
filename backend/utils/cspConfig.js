const contentSecurityPolicy = require("helmet-csp");

const cspConfig = contentSecurityPolicy({
  directives: {
    defaultSrc: [
      "'self'",
      "https://ka-f.fontawesome.com",
      "https://res.cloudinary.com",
      "https://fonts.gstatic.com",
      "https://lh3.googleusercontent.com",
      "https://platform-lookaside.fbsbx.com",
    ],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://kit.fontawesome.com"],
    connectSrc: ["'self'", "https://dev-ot7h-cfg.us.auth0.com"],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://ka-f.fontawesome.com",
      "https://fonts.googleapis.com",
    ],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
  reportOnly: false,
});
module.exports = cspConfig;
