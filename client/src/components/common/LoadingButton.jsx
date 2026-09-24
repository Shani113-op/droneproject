export default function LoadingButton({ loading, onClick, disabled, children, loadingText = "Loading...", type = "button", icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {icon && !loading && icon}
      {loading ? loadingText : children}
    </button>
  );
}
