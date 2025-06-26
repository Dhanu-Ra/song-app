import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const res = await axios.post(endpoint, { username, password });

      if (isLogin) {
        // Store token in localStorage and state
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        navigate('/songs');
      } else {
        setIsLogin(true); // Switch to login after registration
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Action failed');
    }
  };

  return (
    <div className="auth-container">
      {/* ... (same UI as previous example) ... */}
    </div>
  );
}