import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function AlbumPage() {
  const router = useRouter();
  const { id } = router.query;
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [spotifyTracks, setSpotifyTracks] = useState({});

  useEffect(() => {
    if (!id) return;

    fetch(`https://musicbrainz.org/ws/2/release-group/${id}?inc=releases&fmt=json`)
      .then((res) => res.json())
      .then((data) => {
        setAlbum(data);
        if (data.releases?.length > 0) {
          fetch(`https://musicbrainz.org/ws/2/release/${data.releases[0].id}?inc=recordings&fmt=json`)
            .then((res) => res.json())
            .then((releaseData) => {
              setSongs(releaseData.media[0].tracks || []);
              fetchSpotifyPreviews(releaseData.media[0].tracks || []);
            });
        }
      });
  }, [id]);

  async function fetchSpotifyPreviews(songs) {
    const clientId = "0dc5ca619bb5406bb681c2484a6e47ef";
    const clientSecret = "6f4fb1b5981d48aa84d455895029acd9";

    // Get Spotify API token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Search for each song on Spotify
    let trackData = {};
    for (let song of songs) {
      const query = `Imagine Dragons ${song.title}`;
      const searchResponse = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const searchData = await searchResponse.json();
      if (searchData.tracks.items.length > 0) {
        trackData[song.id] = {
          previewUrl: searchData.tracks.items[0].preview_url,
          spotifyUrl: searchData.tracks.items[0].external_urls.spotify,
        };
      }
    }
    setSpotifyTracks(trackData);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{album ? album.title : "Loading..."} - Imagine Dragons</title>
      </Head>
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold">{album?.title}</h1>
        <p className="text-gray-400">{album?.["first-release-date"]}</p>
        {album && (
          <img
            src={`https://coverartarchive.org/release-group/${id}/front-500`}
            alt={`${album.title} cover`}
            className="w-64 h-64 object-cover rounded my-4"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}

        {/* Song List with Spotify Previews */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Songs</h2>
          <ul className="mt-4 space-y-4">
            {songs.length > 0 ? (
              songs.map((song) => (
                <li key={song.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl">{song.title}</h3>

                  {/* Spotify Preview Audio */}
                  {spotifyTracks[song.id]?.previewUrl ? (
                    <audio controls className="mt-2">
                      <source src={spotifyTracks[song.id].previewUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <p className="text-gray-400">Preview not available</p>
                  )}

                  {/* Spotify Direct Link */}
                  {spotifyTracks[song.id]?.spotifyUrl && (
                    <a
                      href={spotifyTracks[song.id].spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline block mt-2"
                    >
                      Listen on Spotify
                    </a>
                  )}

                  {/* YouTube Search Link */}
                  <a
                    href={`https://www.youtube.com/results?search_query=Imagine+Dragons+${song.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline block mt-2"
                  >
                    Watch on YouTube
                  </a>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No songs found...</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
