export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-roboto font-bold">
        Welcome to AI Dashboard 🚀
      </h1>
      <p className="text-lg font-roboto text-gray-600">
        Predict images, videos and manage feedback easily.
      </p>
      <a
        href="/dashboard"
        className="text-white font-roboto rounded shadow hover:bg-blue-200 transition"
      >
        Go to Dashboard
      </a>
    </main>
  );
}
