import { useState, useEffect } from "react";
import axios from "axios";

export default function Songs({ token }) {
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  useEffect(() => {
    axios.get("/api/songs", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setSongs(res.data));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "/api/songs",
      { title, artist },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSongs([...songs, res.data]);
    setTitle("");
    setArtist("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Songs</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song title"
          required
        />
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist"
          required
        />
        <button type="submit">Add Song</button>
      </form>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <strong>{song.title}</strong> by {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}