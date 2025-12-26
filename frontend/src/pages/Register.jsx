import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { confirmSignUp } from 'aws-amplify/auth';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        const result = await authService.register(email, password);

        if (result.success) {
            setNeedsVerification(true);
            setError('');
        } else {
            setError(result.error || 'Registration failed. Please try again.');
        }

        setLoading(false);
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await confirmSignUp({
                username: email,
                confirmationCode: verificationCode
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Verification failed. Please check your code.');
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="card auth-card text-center">
                    <h2>✅ Verification Successful!</h2>
                    <p>Your account has been verified.</p>
                    <p className="text-muted">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    if (needsVerification) {
        return (
            <div className="auth-page">
                <div className="card auth-card">
                    <div className="card-header text-center">
                        <h1>Verify Your Email</h1>
                        <p>We sent a verification code to {email}</p>
                        <p className="text-muted">Check your email inbox (and spam folder)</p>
                    </div>
                    <form onSubmit={handleVerification}>
                        {error && (
                            <div className="toast toast-error mb-3">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Verification Code</label>
                            <input
                                type="text"
                                className="form-input"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                placeholder="Enter 6-digit code from email"
                                maxLength="6"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        <p className="text-center mt-3 text-muted">
                            Didn't receive code? Check your spam folder
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <div className="card-header text-center">
                    <h1>Create Account</h1>
                    <p>Start organizing your courses today</p>
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
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p className="text-center mt-3">
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
