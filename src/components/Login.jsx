import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const API_URL = process.env.REACT_APP_API_URL;

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email, password
            });
            if (signInError) throw signInError;

            const response = await fetch(`${API_URL}/api/admin/profile`, {
                headers: { 'Authorization': `Bearer ${authData.session.access_token}` }
            });
            const data = await response.json();

            if (!data.success) {
                await supabase.auth.signOut();
                throw new Error(data.error || 'Not authorized as admin');
            }

            onLogin({
                session: authData.session,
                admin: data.admin,
                apartment: data.apartment
            });

        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">🏘️</div>
                <h2>Admin Login</h2>
                <p>Access your apartment's dashboard</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login →'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;