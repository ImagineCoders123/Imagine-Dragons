import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Discography() {
  const [albums, setAlbums] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    fetch("https://musicbrainz.org/ws/2/release-group/?query=artist:Imagine%20Dragons&fmt=json")
      .then((res) => res.json())
      .then((data) => setAlbums(data["release-groups"] || []));
  }, []);

  const sortedAlbums = [...albums].sort((a, b) => {
    if (sortOrder === "release-date") {
      return new Date(a["first-release-date"]) - new Date(b["first-release-date"]);
    } else if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === "reverse-alphabetical") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Head>
        <title>Imagine Dragons Discography</title>
      </Head>
      <h1 className="text-4xl font-bold text-center my-6">Discography</h1>
      
      <div className="text-center mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          className="bg-gray-800 p-2 rounded"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="release-date">Release Date</option>
          <option value="alphabetical">A-Z</option>
          <option value="reverse-alphabetical">Z-A</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedAlbums.length > 0 ? (
          sortedAlbums.map((album) => (
            <div key={album.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{album.title}</h2>
              <p className="text-gray-400">{album["first-release-date"]}</p>
              <Link href={`/album/${album.id}`} className="block mt-2 text-blue-400 hover:underline">
                View Album
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Loading albums...</p>
        )}
      </div>
    </div>
  );
}