import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
    const [session, setSession] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setSession(session);
                await fetchAdminProfile(session.access_token);
            } else {
                setLoading(false);
            }
        };
        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setSession(session);
                await fetchAdminProfile(session.access_token);
            } else if (event === 'SIGNED_OUT') {
                setSession(null);
                setAdminData(null);
                setApartment(null);
                setLoading(false);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const fetchAdminProfile = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setAdminData(data.admin);
                setApartment(data.apartment);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleLogin = (userData) => {
        setSession(userData.session);
        setAdminData(userData.admin);
        setApartment(userData.apartment);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setAdminData(null);
        setApartment(null);
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;
    }

    if (!session) {
        return <Login onLogin={handleLogin} />;
    }

    return <Dashboard admin={adminData} apartment={apartment} onLogout={handleLogout} />;
}

export default App;