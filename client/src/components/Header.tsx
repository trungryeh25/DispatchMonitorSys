export default function Header() {
  return (
    <div className="flex items-center justify-between mb-6 mt-6">
      <div className="text-2xl font-roboto font-bold mb-4">
        Dispatch Monitor
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-1 rounded w-64"
      />
    </div>
  );
}
