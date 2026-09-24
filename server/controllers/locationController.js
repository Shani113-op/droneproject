
const geocodingService = require('../services/geocodingService');

exports.getLocation = async (req, res, next) => {
  try {
    const result = await geocodingService.geocodeAddress(req.query.q);
    res.json(result);
  } catch (error) {
    if (error.status === 429) {
      res.set("Retry-After", "2");
    }
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Geocoding error:", error);
    return res.status(500).json({ error: "Unable to search the address right now." });
  }
};
