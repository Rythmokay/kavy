import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login({ onSignupClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/users/login', {
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true // Important for cookies
      });

      // Store the access token in localStorage or context
      if (response.data?.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        if (onLoginSuccess) onLoginSuccess();
        navigate('/dashboard'); // Redirect to dashboard after successful login
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.logo}>
        Swar<span className={styles.mic}>🎤</span>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back 🎶</h2>
        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            className={styles.input} 
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            className={styles.input} 
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button 
            className={styles.loginButton} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className={styles.subText}>
          Don't have an account?{' '}
          <span className={styles.link} onClick={onSignupClick}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
