import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await login({ username, password });
        setLoading(false);

        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow">
                    <div className="card-body p-5">
                        <h3 className="text-center mb-4">HR Portal Login</h3>
                        
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter your username"
                                    autoFocus
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        <hr className="my-4" />
                        <p className="text-center text-muted small">
                            Only authorized admin users can access this portal.
                        </p>
                        
                        {/* Optional: Default credentials hint for testing */}
                        {/* <div className="text-center small text-muted">
                            <p className="mb-0">Default admin credentials:</p>
                            <p className="mb-0">
                                <strong>Username:</strong> admin<br />
                                <strong>Password:</strong> admin123
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;