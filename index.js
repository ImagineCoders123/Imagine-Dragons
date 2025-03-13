import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetch("https://musicbrainz.org/ws/2/release-group/?query=artist:Imagine%20Dragons&fmt=json")
      .then((res) => res.json())
      .then((data) => setAlbums(data["release-groups"] || []));
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen`}>
      <Head>
        <title>Imagine Dragons Discography</title>
      </Head>

      {/* Sticky Navigation Bar */}
      <nav className="bg-gray-800 p-4 shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Imagine Dragons</h1>
          <ul className="flex space-x-6">
            <li><Link href="/"><span className="hover:text-blue-400 cursor-pointer">Home</span></Link></li>
            <li><Link href="/about"><span className="hover:text-blue-400 cursor-pointer">About</span></Link></li>
            <li><Link href="/discography"><span className="hover:text-blue-400 cursor-pointer">Discography</span></Link></li>
            <li><Link href="/songs"><span className="hover:text-blue-400 cursor-pointer">Songs</span></Link></li>
          </ul>
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="ml-4 bg-gray-600 px-3 py-1 rounded hover:bg-gray-500">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-4 text-center mt-16">
        <h1 className="text-4xl font-bold my-6">Welcome to Imagine Dragons Discography</h1>
        <p className="text-gray-300">Explore the full discography, songs, and albums of Imagine Dragons!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {albums.length > 0 ? (
            albums.slice(0, 6).map((album) => (
              <div key={album.id} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
                <h2 className="text-xl font-semibold">{album.title}</h2>
                <p className="text-gray-400">{album["first-release-date"]}</p>
                <img 
                  src={`https://coverartarchive.org/release-group/${album.id}/front-250`} 
                  alt={`${album.title} cover`} 
                  className="w-full h-48 object-cover mt-2 rounded" 
                  onError={(e) => e.target.style.display = "none"} 
                />
                <Link href={`/album/${album.id}`}>
                  <span className="text-blue-400 hover:underline cursor-pointer">View Album</span>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Loading albums...</p>
          )}
        </div>
      </main>
    </div>
  );
}
