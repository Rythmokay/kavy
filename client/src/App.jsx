

// import './App.css'
// import SwarifyLogo from './components/SwarifyLogo'
// import Options from './components/Options';
// import Login from './components/Login';

// function App() {

//   const [showMainContent,setShowMainContent]=useState(false)

//   useEffect(()=>{
//     const timer =setTimeout(()=>{
//       setShowMainContent(true);
//     },2500);
//     return ()=>clearTimeout(timer)
//   },[]);
  

//   return (
//     <>
//       {/* <SwarifyLogo/> */}

//       {!showMainContent ?(
//         <SwarifyLogo/>
//       ):(
//         <Login/>
//       )}
//     </>
//   )
// }

// export default App


import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import SwarifyLogo from './components/SwarifyLogo';
import Options from './components/Options';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

// Set axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000/api';

// Auth context could be added here for better state management

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState('logo');

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Verify token with backend
          await axios.get('/users/me');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle logo animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('options');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <SplashScreen screen={screen} setScreen={setScreen} />
          } />
          <Route path="/login" element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login 
                onSignupClick={() => setScreen('signup')}
                onLoginSuccess={() => setIsAuthenticated(true)}
              />
          } />
          <Route path="/signup" element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Signup 
                onLoginClick={() => setScreen('login')}
                onSignupSuccess={() => setScreen('login')}
              />
          } />
          <Route path="/dashboard" element={
            isAuthenticated ? 
              <Dashboard onLogout={() => {
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
              }} /> : 
              <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Splash screen component
function SplashScreen({ screen, setScreen }) {
  return (
    <>
      {screen === 'logo' && <SwarifyLogo />}
      {screen === 'options' && (
        <Options onOptionClick={() => setScreen('login')} />
      )}
    </>
  );
}

export default App;




