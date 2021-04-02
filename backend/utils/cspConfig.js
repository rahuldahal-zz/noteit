const contentSecurityPolicy = require("helmet-csp");

const cspConfig = contentSecurityPolicy({
  directives: {
    defaultSrc: [
      "'self'",
      "https://res.cloudinary.com",
      "https://fonts.gstatic.com",
      "https://*.googleusercontent.com",
      "https://platform-lookaside.fbsbx.com",
    ],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
  reportOnly: false,
});
module.exports = cspConfig;
