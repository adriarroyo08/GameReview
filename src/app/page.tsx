export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">GamePrice Tracker</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search for a game..."
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </div>
    </main>
  );
}
