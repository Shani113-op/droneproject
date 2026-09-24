export default function MetricCard({ icon, title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 text-blue-600">{icon}</div>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}
