import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';

export default function Signup({ onLoginClick, onSignupSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        // avatar and coverImage will be handled separately if using file upload
      }, {
        withCredentials: true
      });

      if (response.data?.data?.user) {
        if (onSignupSuccess) onSignupSuccess();
        // Optionally log the user in automatically after signup
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.logo}>
        Swar<span className={styles.mic}>🎤</span>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Get Started 🎧</h2>
        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username"
            placeholder="Username" 
            className={styles.input} 
            value={formData.username}
            onChange={handleChange}
            required
          />
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
            minLength="6"
            required
          />
          <input 
            type="password" 
            name="confirmPassword"
            placeholder="Confirm Password" 
            className={styles.input} 
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />

          <button 
            className={styles.signupButton} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.subText}>
          Already have an account?{' '}
          <span className={styles.link} onClick={onLoginClick}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}