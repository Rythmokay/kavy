import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome to Swarify</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>
      <main className={styles.mainContent}>
        <h2>Your Music Dashboard</h2>
        <p>You are now logged in and ready to explore music!</p>
        {/* Add more dashboard content here */}
      </main>
    </div>
  );
};

export default Dashboard;
