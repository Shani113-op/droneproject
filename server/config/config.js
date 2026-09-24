
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  geocoderContactEmail: process.env.GEOCODER_CONTACT_EMAIL
};
