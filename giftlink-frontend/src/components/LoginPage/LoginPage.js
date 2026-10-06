import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('auth-token');
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (bearerToken) navigate('/app');
  }, [navigate, bearerToken]);

  const handleLogin = async () => {
    const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();

    if (json.authtoken) {
      sessionStorage.setItem('auth-token', json.authtoken);
      sessionStorage.setItem('name', json.userName);
      sessionStorage.setItem('email', json.userEmail);
      setIsLoggedIn(true);
      navigate('/app');
    } else {
      setIncorrect('Wrong password. Try again.');
      setTimeout(() => setIncorrect(''), 2000);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 450 }}>
      <h2>Login</h2>
      <input className="form-control mb-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="text-danger mb-2">{incorrect}</div>
      <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
