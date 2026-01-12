export default function Home() {
  // This page is effectively invisible because proxy.js
  // redirects everyone (Guest -> Login, User -> Library).
  // But we put a loading spinner here just in case of a split-second delay.
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
