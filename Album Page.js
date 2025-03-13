import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function SongPage() {
  const router = useRouter();
  const { id } = router.query;
  const [song, setSong] = useState(null);
  const [lyrics, setLyrics] = useState("Loading lyrics...");

  useEffect(() => {
    if (!id) return;

    fetch(`https://musicbrainz.org/ws/2/recording/${id}?inc=releases&fmt=json`)
      .then((res) => res.json())
      .then((data) => {
        setSong(data);
        fetchLyrics(data.title);
      });
  }, [id]);

  async function fetchLyrics(songTitle) {
    const accessToken = "YOUR_GENIUS_API_ACCESS_TOKEN";
    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(songTitle + " Imagine Dragons")}`;

    const response = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();

    if (data.response.hits.length > 0) {
      const songPath = data.response.hits[0].result.path;
      setLyrics(`https://genius.com${songPath}`);
    } else {
      setLyrics("Lyrics not found.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{song ? song.title : "Loading..."} - Imagine Dragons</title>
      </Head>
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold">{song?.title}</h1>
        <p className="text-gray-400">{song?.["first-release-date"]}</p>

        {/* Lyrics Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Lyrics</h2>
          <p className="mt-4 text-gray-300">
            {lyrics.startsWith("http") ? (
              <a href={lyrics} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                View Lyrics on Genius
              </a>
            ) : (
              lyrics
            )}
          </p>
        </div>
      </main>
    </div>
  );
}