import { Mail } from "lucide-react";

export default function ReportSection() {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-900 p-6 text-white">
      <Mail className="text-blue-400" />
      <div>
        <h3 className="font-semibold">Email Analysis Report</h3>
        <p className="text-sm text-slate-400">Report generation will be added later.</p>
      </div>
    </div>
  );
}
