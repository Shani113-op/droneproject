export default function SectionCard({ children, className = "" }) {
  return (
    <div className={`rounded-xl bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
