import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await authService.login(email, password);

        if (result.success) {
            onLogin();
            navigate('/dashboard');
        } else {
            setError(result.error || 'Login failed. Please check your credentials.');
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <div className="card-header text-center">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account to continue</p>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="toast toast-error mb-3">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="text-center mt-3">
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--primary)' }}>Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
