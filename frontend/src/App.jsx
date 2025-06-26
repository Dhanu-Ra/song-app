import { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Login Page
function Login({ setToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/login', { username, password })
      setToken(res.data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

// Songs Page
function Songs({ token }) {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/songs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSongs(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load songs')
        setLoading(false)
      })
  }, [token])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Songs</h1>
      <ul>
        {songs.map(song => (
          <li key={song.id}>
            <strong>{song.title}</strong> by {song.artist}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Main App
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={token ? <Navigate to="/songs" /> : <Login setToken={setToken} />} 
        />
        <Route 
          path="/songs" 
          element={token ? <Songs token={token} /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}