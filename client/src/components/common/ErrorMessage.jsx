export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
      {message}
    </div>
  );
}
