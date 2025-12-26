import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import PublicCatalog from './pages/PublicCatalog';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const result = await authService.getCurrentUser();
        if (result.success) {
            setUser(result.user);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await authService.logout();
        setUser(null);
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <Router>
            <div className="app">
                <Navbar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/login" element={
                        user ? <Navigate to="/dashboard" /> : <Login onLogin={() => checkUser()} />
                    } />
                    <Route path="/register" element={
                        user ? <Navigate to="/dashboard" /> : <Register />
                    } />
                    <Route path="/catalog" element={<PublicCatalog />} />
                    <Route path="/dashboard" element={
                        user ? <Dashboard user={user} /> : <Navigate to="/login" />
                    } />
                    <Route path="/courses" element={
                        user ? <Courses /> : <Navigate to="/login" />
                    } />
                    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
