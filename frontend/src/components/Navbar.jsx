import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
    return (
        <nav>
            <div className="nav-container">
                <Link to="/" className="nav-logo">📚 Course Planner</Link>
                <ul className="nav-links">
                    {user ? (
                        <>
                            <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                            <li><Link to="/courses" className="nav-link">My Courses</Link></li>
                            <li><Link to="/catalog" className="nav-link">Public Catalog</Link></li>
                            <li>
                                <button onClick={onLogout} className="btn btn-sm btn-secondary">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/catalog" className="nav-link">Public Catalog</Link></li>
                            <li><Link to="/login" className="btn btn-sm btn-primary">Login</Link></li>
                            <li><Link to="/register" className="btn btn-sm btn-secondary">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
