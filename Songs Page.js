import { useEffect, useState } from "react";
import Head from "next/head";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    fetch("https://musicbrainz.org/ws/2/recording/?query=artist:Imagine%20Dragons&fmt=json")
      .then((res) => res.json())
      .then((data) => setSongs(data.recordings || []));
  }, []);

  const sortedSongs = [...songs].sort((a, b) => {
    if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === "reverse-alphabetical") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Head>
        <title>Imagine Dragons Songs</title>
      </Head>
      <h1 className="text-4xl font-bold text-center my-6">Songs</h1>
      
      <div className="text-center mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          className="bg-gray-800 p-2 rounded"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="alphabetical">A-Z</option>
          <option value="reverse-alphabetical">Z-A</option>
        </select>
      </div>
      
      <ul className="max-w-2xl mx-auto text-lg text-gray-300">
        {sortedSongs.length > 0 ? (
          sortedSongs.map((song) => (
            <li key={song.id} className="border-b border-gray-700 py-2">
              {song.title}
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">Loading songs...</p>
        )}
      </ul>
    </div>
  );
}