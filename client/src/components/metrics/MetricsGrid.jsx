import { MapPin, Clock, DollarSign } from "lucide-react";
import MetricCard from "./MetricCard";

export default function MetricsGrid({ radius, responseResult }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <MetricCard icon={<MapPin />} title="Coverage Radius" value={`${radius} km`} />
      <MetricCard
        icon={<Clock />}
        title="Drone Response Time"
        value={responseResult ? `${responseResult.droneResponseMin} min` : "Calculate below"}
      />
      <MetricCard icon={<DollarSign />} title="ROI Analysis" value="Coming soon" />
    </div>
  );
}
