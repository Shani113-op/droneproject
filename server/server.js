
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./config/config");

const locationRoutes = require("./routes/locationRoutes");
const responseTimeRoutes = require("./routes/responseTimeRoutes");
const callSimulationRoutes = require("./routes/callSimulationRoutes");
const roiRoutes = require("./routes/roiRoutes");
const reportRoutes = require("./routes/reportRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
  origin: config.frontendUrl
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Drone ROI Backend Running"
  });
});

app.use("/api/location", locationRoutes);
app.use("/api/response-time", responseTimeRoutes);
app.use("/api/call-simulation", callSimulationRoutes);
app.use("/api/roi", roiRoutes);
app.use("/api/report", reportRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log("Backend running on http://localhost:" + config.port);
});
