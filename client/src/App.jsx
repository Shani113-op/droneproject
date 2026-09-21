import { useState, useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  Plane,
  MapPin,
  Clock,
  DollarSign,
  Mail,
  Search,
} from "lucide-react";

// Default demonstration location: Mumbai
const LOCATION = [19.076, 72.8777];

// Backend URL
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// --------------------------------------------------
// MAP UPDATER
// Moves map when a new location is selected
// --------------------------------------------------

function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);

  return null;
}

// --------------------------------------------------
// MAIN APPLICATION
// --------------------------------------------------

function App() {
  // Coverage radius
  const [radius, setRadius] = useState(5);

  // Address search
  const [address, setAddress] = useState("");

  // Map coordinates
  const [location, setLocation] = useState(LOCATION);

  // Selected location name
  const [locationName, setLocationName] = useState(
    "Mumbai, Maharashtra (Demo)"
  );

  // API loading state
  const [loading, setLoading] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Has user selected a real location?
  const [locationSelected, setLocationSelected] =
    useState(false);



  // Response-time inputs
  const [distanceKm, setDistanceKm] = useState(5);

  const [droneSpeedKmh, setDroneSpeedKmh] =
    useState(50);

  const [launchDelayMin, setLaunchDelayMin] =
    useState(1);

  const [patrolResponseMin, setPatrolResponseMin] =
    useState(8.6);

  // Calculation result
  const [responseResult, setResponseResult] =
    useState(null);

  const [responseError, setResponseError] =
    useState("");

  const [calculating, setCalculating] =
    useState(false);


  // ----------------------------------
  // CALL SIMULATION STATES
  // ----------------------------------

  const [annualCalls, setAnnualCalls] =
    useState("10000");

  const [
    coverageCallSharePct,
    setCoverageCallSharePct
  ] = useState("40");

  const [
    eligibleCallSharePct,
    setEligibleCallSharePct
  ] = useState("30");

  const [
    droneAvailabilityPct,
    setDroneAvailabilityPct
  ] = useState("80");

  const [simulationResult, setSimulationResult] =
    useState(null);

  const [simulationError, setSimulationError] =
    useState("");

  const [simulating, setSimulating] =
    useState(false);

  // --------------------------------------------------
  // COVERAGE CALCULATION
  // --------------------------------------------------

  const coverageArea = Math.PI * radius * radius;

  // --------------------------------------------------
  // ADDRESS SEARCH FUNCTION
  // --------------------------------------------------

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      setError("Please enter a police department address.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/location?q=${encodeURIComponent(
          address.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to find the location."
        );
      }

      const latitude = Number(data.latitude);
      const longitude = Number(data.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180
      ) {
        throw new Error(
          "Location provider returned invalid coordinates."
        );
      }

      // Update the map location
      setLocation([latitude, longitude]);

      // Update displayed address
      setLocationName(data.address);

      // Mark location as selected
      setLocationSelected(true);

    } catch (err) {
      console.error("Location Search Error:", err);

      setError(
        err.message || "Something went wrong. Try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // ----------------------------------
  // CALCULATE RESPONSE TIME
  // ----------------------------------

  const handleResponseCalculation = async () => {

    setCalculating(true);
    setResponseError("");
    setResponseResult(null);

    try {

      const response = await fetch(
        `${API_URL}/api/response-time`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            distanceKm,
            droneSpeedKmh,
            launchDelayMin,
            patrolResponseMin,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Calculation failed."
        );
      }

      setResponseResult(data.result);

    } catch (error) {

      console.error(error);

      setResponseError(error.message);

    } finally {

      setCalculating(false);

    }

  };

  // ----------------------------------
  // CALL SIMULATION FUNCTION
  // ----------------------------------

  const handleCallSimulation = async () => {

    setSimulating(true);
    setSimulationError("");
    setSimulationResult(null);

    try {

      const response = await fetch(
        `${API_URL}/api/call-simulation`,
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            annualCalls: Number(annualCalls),

            radiusKm: radius,

            coverageCallSharePct:
              Number(coverageCallSharePct),

            eligibleCallSharePct:
              Number(eligibleCallSharePct),

            droneAvailabilityPct:
              Number(droneAvailabilityPct),

            droneSpeedKmh,

            launchDelayMin,

            patrolResponseMin,

          }),

        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || "Simulation failed."
        );

      }

      setSimulationResult({
        ...data.result,
        inputSignature: JSON.stringify([
          annualCalls,
          radius,
          coverageCallSharePct,
          eligibleCallSharePct,
          droneAvailabilityPct,
          droneSpeedKmh,
          launchDelayMin,
          patrolResponseMin
        ])
      });

    } catch (error) {

      console.error(error);

      setSimulationError(error.message);

    } finally {

      setSimulating(false);

    }

  };

  // Prevent outdated results appearing after inputs change.
  const currentSimulationSignature = JSON.stringify([
    annualCalls,
    radius,
    coverageCallSharePct,
    eligibleCallSharePct,
    droneAvailabilityPct,
    droneSpeedKmh,
    launchDelayMin,
    patrolResponseMin
  ]);

  const visibleSimulation =
    simulationResult?.inputSignature ===
      currentSimulationSignature
      ? simulationResult
      : null;

  const validSimulationInputs =
    [annualCalls, coverageCallSharePct,
      eligibleCallSharePct, droneAvailabilityPct]
      .every(value => value.trim() !== "") &&
    Number.isInteger(Number(annualCalls)) &&
    Number(annualCalls) >= 0 &&
    Number(annualCalls) <= 10000000 &&
    [
      coverageCallSharePct,
      eligibleCallSharePct,
      droneAvailabilityPct
    ].every(value =>
      Number(value) >= 0 &&
      Number(value) <= 100
    );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}

      <nav className="flex items-center justify-between bg-slate-950 px-8 py-5 text-white">

        <div className="flex items-center gap-3">

          <Plane className="text-blue-400" />

          <h1 className="text-xl font-bold">
            DroneROI
          </h1>

        </div>

        <span className="text-sm text-slate-400">
          First Responder Simulator
        </span>

      </nav>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl space-y-8 p-8">

        {/* HEADING */}

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            Drone First Responder Analysis
          </h2>

          <p className="mt-2 text-slate-500">
            Explore drone coverage and response potential.
          </p>

        </div>

        {/* ADDRESS SEARCH */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <MapPin className="text-blue-600" />

            <h3 className="text-lg font-semibold">
              Police Department Location
            </h3>

          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row"
          >

            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter police department address, city, country..."
              aria-label="Police department address"
              required
              maxLength={200}
              className="flex-1 rounded-lg border border-slate-300 p-4 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Search size={18} />

              {loading
                ? "Searching..."
                : "Analyze Location"}

            </button>

          </form>

          {/* ERROR MESSAGE */}

          {error && (

            <div
              role="alert"
              className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600"
            >

              {error}

            </div>

          )}

          {/* SELECTED LOCATION */}

          <div className="mt-5 rounded-lg bg-slate-50 p-4">

            <div className="flex items-start gap-3">

              <MapPin
                size={20}
                className="mt-1 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-xs text-slate-500">
                  Selected Location
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {locationName}
                </p>

                <p className="mt-2 text-xs text-slate-500">

                  Latitude: {location[0].toFixed(6)}

                  {" | "}

                  Longitude: {location[1].toFixed(6)}

                </p>

                {!locationSelected && (

                  <p className="mt-2 text-xs text-amber-600">
                    Demonstration location. Search for your
                    department to begin.
                  </p>

                )}

                {locationSelected && (

                  <p className="mt-2 text-xs text-green-600">
                    Location found. Verify that this is
                    your intended drone launch site.
                  </p>

                )}

              </div>

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Geocoding: © OpenStreetMap contributors
              (Nominatim).
            </p>

          </div>

        </div>

        {/* METRIC CARDS */}

        <div className="grid gap-6 md:grid-cols-3">

          <MetricCard
            icon={<MapPin />}
            title="Coverage Radius"
            value={`${radius} km`}
          />

          <MetricCard
            icon={<Clock />}
            title="Drone Response Time"
            value={
              responseResult
                ? `${responseResult.droneResponseMin} min`
                : "Calculate below"
            }
          />

          <MetricCard
            icon={<DollarSign />}
            title="ROI Analysis"
            value="Coming soon"
          />

        </div>

        {/* MAP SECTION */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* MAP */}

          <div className="overflow-hidden rounded-xl bg-white shadow-sm lg:col-span-2">

            <div className="border-b p-5">

              <h3 className="text-lg font-semibold">
                Drone Coverage Map
              </h3>

              <p className="text-sm text-slate-500">
                Theoretical circular coverage only
              </p>

            </div>

            <div className="h-[450px]">

              <MapContainer
                center={location}
                zoom={11}
                scrollWheelZoom={true}
                className="h-full w-full"
              >

                {/* Automatically update map */}

                <MapUpdater center={location} />

                {/* OpenStreetMap */}

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Drone coverage circle */}

                <Circle
                  center={location}
                  radius={radius * 1000}
                  pathOptions={{
                    color: "#2563eb",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.15,
                  }}
                />

                {/* Department location marker */}

                <CircleMarker
                  center={location}
                  radius={8}
                  pathOptions={{
                    color: "#ffffff",
                    fillColor: "#2563eb",
                    fillOpacity: 1,
                  }}
                >

                  <Popup>
                    <div>
                      <strong>
                        {locationSelected
                          ? "Selected Location"
                          : "Demo Location"}
                      </strong>

                      <p>{locationName}</p>

                      <p>
                        Coverage Radius: {radius} km
                      </p>
                    </div>
                  </Popup>

                </CircleMarker>

              </MapContainer>

            </div>

          </div>

          {/* COVERAGE SIDEBAR */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h3 className="mb-6 text-lg font-semibold">
              Coverage Settings
            </h3>

            <label
              htmlFor="radius"
              className="text-sm font-medium"
            >
              Drone Radius: {radius} km
            </label>

            <input
              id="radius"
              type="range"
              min="1"
              max="10"
              value={radius}
              onChange={(e) =>
                setRadius(Number(e.target.value))
              }
              className="mt-4 w-full cursor-pointer"
            />

            <div className="mt-8 rounded-lg bg-blue-50 p-5">

              <p className="text-sm text-slate-600">
                Theoretical Coverage Area
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-700">
                {coverageArea.toFixed(2)} km²
              </h2>

            </div>

            <div className="mt-6 rounded-lg bg-slate-50 p-4">

              <p className="text-sm font-medium text-slate-700">
                Coverage Information
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Radius: {radius} km
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Area: {coverageArea.toFixed(2)} km²
              </p>

            </div>

            <p className="mt-6 text-xs leading-relaxed text-slate-500">

              Demonstration only. The circular area
              is a geometric estimate, not verified
              operational coverage.

              Actual coverage depends on aircraft
              capabilities, airspace restrictions,
              weather, battery life and regulations.

            </p>

          </div>

        </div>

        {/* RESPONSE TIME ANALYSIS */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h3 className="text-xl font-bold text-slate-900">
              Drone vs Patrol Response Time
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Compare estimated drone arrival with a
              patrol response-time benchmark.
            </p>

          </div>

          {/* INPUTS */}

          <div className="grid gap-5 md:grid-cols-2">

            {/* DISTANCE */}

            <div>

              <label className="text-sm font-medium">
                Emergency Distance (km)
              </label>

              <input
                type="number"
                min="0"
                max={radius}
                step="0.1"
                value={distanceKm}
                onChange={(e) => {
                  setDistanceKm(Number(e.target.value));
                  setResponseResult(null);
                }}
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Straight-line distance from launch site.
                Coverage radius: {radius} km.
              </p>

            </div>

            {/* DRONE SPEED */}

            <div>

              <label className="text-sm font-medium">
                Drone Speed (km/h)
              </label>

              <input
                type="number"
                min="1"
                max="200"
                step="1"
                value={droneSpeedKmh}
                onChange={(e) => {
                  setDroneSpeedKmh(Number(e.target.value));
                  setResponseResult(null);
                }}
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Illustrative assumption. Replace with
                a sourced aircraft cruise speed.
              </p>

            </div>

            {/* LAUNCH DELAY */}

            <div>

              <label className="text-sm font-medium">
                Launch Delay (minutes)
              </label>

              <input
                type="number"
                min="0"
                max="60"
                step="0.1"
                value={launchDelayMin}
                onChange={(e) => {
                  setLaunchDelayMin(Number(e.target.value));
                  setResponseResult(null);
                }}
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Estimated time from receiving a call
                until takeoff.
              </p>

            </div>

            {/* PATROL RESPONSE */}

            <div>

              <label className="text-sm font-medium">
                Patrol Response (minutes)
              </label>

              <input
                type="number"
                min="0.1"
                max="180"
                step="0.1"
                value={patrolResponseMin}
                onChange={(e) => {
                  setPatrolResponseMin(Number(e.target.value));
                  setResponseResult(null);
                }}
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Default: Chula Vista PD, 2022,
                Priority 1 comparison.
              </p>

            </div>

          </div>

          {/* CALCULATE BUTTON */}

          <button
            onClick={handleResponseCalculation}
            disabled={
              calculating ||
              distanceKm < 0 ||
              distanceKm > radius ||
              !Number.isFinite(distanceKm) ||
              !Number.isFinite(droneSpeedKmh) ||
              !Number.isFinite(launchDelayMin) ||
              !Number.isFinite(patrolResponseMin)
            }
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >

            {calculating
              ? "Calculating..."
              : "Calculate Response Time"}

          </button>

          {/* ERROR */}

          {responseError && (

            <p
              role="alert"
              className="mt-4 text-sm text-red-600"
            >
              {responseError}
            </p>

          )}

          {/* RESULTS */}

          {responseResult && (

            <div className="mt-8">

              <h4 className="mb-5 text-lg font-bold">
                Response Time Results
              </h4>

              <div className="grid gap-4 md:grid-cols-3">

                {/* DRONE */}

                <div className="rounded-lg bg-blue-50 p-5">

                  <Plane className="text-blue-600" />

                  <p className="mt-3 text-sm text-slate-600">
                    Drone Response
                  </p>

                  <h3 className="text-3xl font-bold text-blue-700">
                    {responseResult.droneResponseMin} min
                  </h3>

                </div>

                {/* PATROL */}

                <div className="rounded-lg bg-slate-100 p-5">

                  <Clock className="text-slate-700" />

                  <p className="mt-3 text-sm text-slate-600">
                    Patrol Response
                  </p>

                  <h3 className="text-3xl font-bold text-slate-800">
                    {responseResult.patrolResponseMin} min
                  </h3>

                </div>

                {/* FIRST ARRIVAL */}

                <div className="rounded-lg bg-green-50 p-5">

                  <MapPin className="text-green-700" />

                  <p className="mt-3 text-sm text-slate-600">
                    First Arrival
                  </p>

                  <h3 className="text-2xl font-bold text-green-700">
                    {responseResult.firstArrival}
                  </h3>

                </div>

              </div>

              {/* DETAILED RESULT */}

              <div className="mt-5 rounded-lg border p-5">

                <p className="font-semibold">
                  Time Difference
                </p>

                <p className="mt-2 text-2xl font-bold">

                  {Math.abs(
                    responseResult.timeDifferenceMin
                  ).toFixed(2)} minutes

                </p>

                <p className="mt-2 text-sm text-slate-600">

                  {responseResult.firstArrival === "Drone"
                    ? "Drone arrives earlier than patrol."
                    : responseResult.firstArrival === "Patrol"
                      ? "Patrol arrives earlier than drone."
                      : "Both arrive at approximately the same time."}

                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Drone flight:
                  {" "}
                  {responseResult.flightTimeMin} min
                  {" + "}
                  Launch:
                  {" "}
                  {responseResult.launchDelayMin} min
                </p>

              </div>

            </div>

          )}

          {/* METHODOLOGY */}

          <div className="mt-6 rounded-lg bg-slate-50 p-4">

            <p className="text-sm font-semibold">
              Methodology and limitations
            </p>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Drone response = launch delay +
              (straight-line distance / drone speed) × 60.
              Speed and launch delay are illustrative
              assumptions. Patrol response defaults to a
              published 2022 Chula Vista Priority 1
              benchmark, not a local department forecast.
              Airspace and weather delays are excluded.
            </p>

            <a
              href="https://popcenter.asu.edu/sites/g/files/litvpz3631/files/drones_as_first_responders_chula_vista_pd_2022.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-blue-600 underline"
            >
              View patrol response-time source
            </a>

          </div>

        </div>

        {/* CALL SIMULATION SECTION */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-6">

            <h3 className="text-xl font-bold text-slate-900">
              Drone First-Arrival Analysis
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Estimate the percentage of emergency calls
              a drone could reach before police patrol.
            </p>

            <p className="mt-2 text-xs text-amber-700">
              Scenario estimates only. Replace example
              inputs with verified department data.
            </p>

          </div>

          {/* INPUTS */}

          <div className="grid gap-5 md:grid-cols-2">

            {/* ANNUAL CALLS */}

            <div>

              <label className="text-sm font-medium">
                Annual Emergency Calls
              </label>

              <input
                type="number"
                min="0"
                max="10000000"
                step="1"
                value={annualCalls}
                onChange={(e) =>
                  setAnnualCalls(e.target.value)
                }
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Example only. Enter actual annual emergency-call volume.
              </p>

            </div>

            {/* COVERAGE SHARE */}

            <div>

              <label className="text-sm font-medium">
                Calls Within Coverage (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={coverageCallSharePct}
                onChange={(e) =>
                  setCoverageCallSharePct(e.target.value)
                }
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Estimated percentage of all calls located
                within the drone coverage circle.
              </p>

            </div>

            {/* ELIGIBILITY */}

            <div>

              <label className="text-sm font-medium">
                Drone-Eligible Calls (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={eligibleCallSharePct}
                onChange={(e) =>
                  setEligibleCallSharePct(e.target.value)
                }
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Percentage of covered calls suitable
                for drone deployment.
              </p>

            </div>

            {/* AVAILABILITY */}

            <div>

              <label className="text-sm font-medium">
                Drone Availability (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={droneAvailabilityPct}
                onChange={(e) =>
                  setDroneAvailabilityPct(e.target.value)
                }
                className="mt-2 w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-xs text-slate-500">
                Percentage of covered, eligible calls
                with a drone available for dispatch.
              </p>

            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={handleCallSimulation}
            disabled={
              simulating ||
              !validSimulationInputs
            }
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >

            {simulating
              ? "Calculating..."
              : "Calculate First-Arrival Percentage"}

          </button>

          {/* ERROR */}

          {simulationError && (

            <p
              role="alert"
              className="mt-4 text-sm text-red-600"
            >
              {simulationError}
            </p>

          )}

          {/* RESULTS */}

          {visibleSimulation && (

            <div className="mt-8">

              <h4 className="mb-5 text-lg font-bold">
                First-Arrival Results
              </h4>

              <div className="grid gap-4 md:grid-cols-3">

                {/* COVERED CALLS */}

                <div className="rounded-lg bg-blue-50 p-5">

                  <p className="text-sm text-slate-600">
                    Calls Within Coverage
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-blue-700">
                    {visibleSimulation.coveredCalls.toLocaleString()}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    Estimated calls per year
                  </p>

                </div>

                {/* ELIGIBLE CALLS */}

                <div className="rounded-lg bg-slate-100 p-5">

                  <p className="text-sm text-slate-600">
                    Drone-Eligible Calls
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-slate-800">
                    {visibleSimulation.eligibleCalls.toLocaleString()}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    Estimated calls per year
                  </p>

                </div>

                {/* FIRST ARRIVAL CALLS */}

                <div className="rounded-lg bg-green-50 p-5">

                  <p className="text-sm text-slate-600">
                    Drone Arrives First
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-green-700">
                    {visibleSimulation.firstArrivalCalls.toLocaleString()}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    Estimated calls per year
                  </p>

                </div>

              </div>

              {/* FIRST ARRIVAL PERCENTAGE */}

              <div className="mt-5 rounded-xl bg-slate-900 p-6 text-white">

                <p className="text-sm text-slate-300">
                  Drone-First Share of All Emergency Calls
                </p>

                <h2 className="mt-3 text-5xl font-bold text-green-400">

                  {visibleSimulation.firstArrivalAllCallsPct}%

                </h2>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">

                  <div
                    className="h-full rounded-full bg-green-400"
                    style={{
                      width:
                        `${visibleSimulation.firstArrivalAllCallsPct}%`
                    }}
                  />

                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Percentage of the department's total
                  annual emergency-call volume.
                </p>

              </div>

              {/* ADDITIONAL METRICS */}

              <div className="mt-5 rounded-lg border p-5">

                <h4 className="font-semibold">
                  Additional Analysis
                </h4>

                <p className="mt-3 text-sm text-slate-600">
                  Drone Available:
                  {" "}
                  <strong>
                    {visibleSimulation.availableCalls.toLocaleString()}
                  </strong>
                  {" "}
                  estimated calls/year
                </p>

                <p className="mt-3 text-sm text-slate-600">
                  First-arrival share within coverage:
                  {" "}
                  <strong>
                    {visibleSimulation.firstArrivalWithinCoveragePct}%
                  </strong>
                </p>

                <p className="mt-3 text-sm text-slate-600">
                  Break-even flight distance:
                  {" "}
                  <strong>
                    {visibleSimulation.breakEvenDistanceKm} km
                  </strong>
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  The within-coverage percentage assumes
                  an eligible call, drone availability and
                  uniform call locations. The all-call
                  percentage also accounts for estimated
                  coverage, eligibility and availability.
                </p>

              </div>

            </div>

          )}

          {/* METHODOLOGY */}

          <div className="mt-6 rounded-lg bg-slate-50 p-5">

            <h4 className="text-sm font-semibold">
              Methodology and Assumptions
            </h4>

            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              The model assumes call locations are uniformly
              distributed inside the coverage circle and uses
              a constant patrol response-time baseline.
              Coverage, eligibility and availability percentages
              are editable estimates, not measured department data.
            </p>

            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              This calculation excludes weather, airspace,
              dispatch variation, overlapping missions and
              actual emergency-call geography.
              A drone arriving first does not automatically
              eliminate the need for police officers.
            </p>

          </div>

        </div>

        {/* REPORT */}

        <div className="flex items-center gap-4 rounded-xl bg-slate-900 p-6 text-white">

          <Mail className="text-blue-400" />

          <div>

            <h3 className="font-semibold">
              Email Analysis Report
            </h3>

            <p className="text-sm text-slate-400">
              Report generation will be added later.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

// --------------------------------------------------
// METRIC CARD COMPONENT
// --------------------------------------------------

function MetricCard({ icon, title, value }) {

  return (

    <div className="rounded-xl bg-white p-6 shadow-sm">

      <div className="mb-4 text-blue-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="mt-2 text-2xl font-bold">
        {value}
      </h3>

    </div>

  );

}

export default App;