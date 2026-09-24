import { Plane } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-slate-950 px-8 py-5 text-white">
      <div className="flex items-center gap-3">
        <Plane className="text-blue-400" />
        <h1 className="text-xl font-bold">DroneROI</h1>
      </div>
      <span className="text-sm text-slate-400">First Responder Simulator</span>
    </nav>
  );
}
