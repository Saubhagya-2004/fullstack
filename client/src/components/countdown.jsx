export default function CountdownTimer({ endTime, now }) {
  if (!endTime || !now) return <p>⏳ Loading...</p>;

  const remaining = Math.max(0, endTime - now);
  const seconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(seconds / 60);

  return (
    <p className="text-sm text-gray-600">
      ⏳ {minutes}m {seconds % 60}s
    </p>
  );
}
