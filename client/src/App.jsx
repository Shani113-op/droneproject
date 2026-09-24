import { useState, useCallback, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import AddressSearch from "./components/location/AddressSearch";
import SelectedLocation from "./components/location/SelectedLocation";
import CoverageMap from "./components/map/CoverageMap";
import CoverageSettings from "./components/map/CoverageSettings";
import MetricsGrid from "./components/metrics/MetricsGrid";
import ResponseTimeAnalysis from "./components/response/ResponseTimeAnalysis";
import CallSimulation from "./components/simulation/CallSimulation";
import ROIAnalysis from "./components/roi/ROIAnalysis";
import EmailForm from "./components/report/EmailForm";

import { useLocationSearch } from "./hooks/useLocationSearch";

import {
  LOCATION,
  DEFAULT_RADIUS,
  DEFAULT_DRONE_SPEED_KMH,
  DEFAULT_LAUNCH_DELAY_MIN,
  DEFAULT_PATROL_RESPONSE_MIN,
  DEFAULT_ANNUAL_CALLS,
  DEFAULT_COVERAGE_CALL_SHARE_PCT,
  DEFAULT_ELIGIBLE_CALL_SHARE_PCT,
  DEFAULT_DRONE_AVAILABILITY_PCT
} from "./constants/defaults";

function App() {
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [location, setLocation] = useState(LOCATION);
  const [locationName, setLocationName] = useState("Mumbai, Maharashtra (Demo)");
  const [locationSelected, setLocationSelected] = useState(false);
  const [responseResult, setResponseResult] = useState(null);
  const [simulationResult, setSimulationResult] = useState(null);
  const [reportData, setReportData] = useState({});

  // When these change, they should feed into the report data
  const handleResponseResult = useCallback((res) => {
    setResponseResult(res);
    setReportData(prev => ({
      ...prev,
      droneResponseMin: res.droneResponseMin,
      patrolResponseMin: res.patrolResponseMin,
      firstArrival: res.firstArrival
    }));
  }, []);

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    const data = await search();
    if (data) {
      setLocation([Number(data.latitude), Number(data.longitude)]);
      setLocationName(data.address);
      setLocationSelected(true);
      setReportData(prev => ({ ...prev, locationName: data.address }));
    }
  };

  const { address, setAddress, loading, error, search } = useLocationSearch();

  // Also track map changes in report safely
  useEffect(() => {
    const currentCoverageArea = (Math.PI * Math.pow(radius, 2)).toFixed(2);
    setReportData(prev => {
      if (prev.radius !== radius || prev.coverageArea !== currentCoverageArea) {
        return { ...prev, radius, coverageArea: currentCoverageArea };
      }
      return prev;
    });
  }, [radius]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Drone First Responder Analysis</h2>
          <p className="mt-2 text-slate-500">Explore drone coverage, response potential, and ROI.</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <AddressSearch
            address={address}
            setAddress={setAddress}
            loading={loading}
            error={error}
            onSearch={handleLocationSearch}
          />
          <SelectedLocation
            location={location}
            locationName={locationName}
            locationSelected={locationSelected}
          />
        </div>

        <MetricsGrid radius={radius} responseResult={responseResult} />

        <div className="grid gap-6 lg:grid-cols-3">
          <CoverageMap
            location={location}
            locationName={locationName}
            radius={radius}
            locationSelected={locationSelected}
          />
          <CoverageSettings radius={radius} setRadius={setRadius} />
        </div>

        <ResponseTimeAnalysis
          radius={radius}
          defaultDroneSpeedKmh={DEFAULT_DRONE_SPEED_KMH}
          defaultLaunchDelayMin={DEFAULT_LAUNCH_DELAY_MIN}
          defaultPatrolResponseMin={DEFAULT_PATROL_RESPONSE_MIN}
          setAppResponseResult={handleResponseResult}
        />

        <CallSimulation
          radius={radius}
          defaultDroneSpeedKmh={DEFAULT_DRONE_SPEED_KMH}
          defaultLaunchDelayMin={DEFAULT_LAUNCH_DELAY_MIN}
          defaultPatrolResponseMin={DEFAULT_PATROL_RESPONSE_MIN}
          defaultAnnualCalls={DEFAULT_ANNUAL_CALLS}
          defaultCoverageCallSharePct={DEFAULT_COVERAGE_CALL_SHARE_PCT}
          defaultEligibleCallSharePct={DEFAULT_ELIGIBLE_CALL_SHARE_PCT}
          defaultDroneAvailabilityPct={DEFAULT_DRONE_AVAILABILITY_PCT}
          setAppSimulationResult={setSimulationResult}
        />

        <ROIAnalysis 
          simulationResult={simulationResult} 
          setReportData={setReportData}
        />

        <EmailForm reportData={reportData} />
      </main>
    </div>
  );
}

export default App;

