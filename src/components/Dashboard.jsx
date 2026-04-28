import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getAccessToken } from '../services/supabase';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard({ admin, apartment, onLogout }) {
    const [stats, setStats] = useState({ 
        totalResidents: 0, 
        visitorsInside: 0, 
        vehiclesInside: 0, 
        totalVehicles: 0, 
        activeGuards: 0 
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!apartment) {
            setLoading(false);
            return;
        }
        
        try {
            const token = await getAccessToken();
            if (!token) {
                console.error('No token available');
                setLoading(false);
                return;
            }
            
            const response = await axios.get(`${API_URL}/api/admin/${apartment.id}/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (err) { 
            console.error('Error fetching stats:', err); 
        } finally { 
            setLoading(false); 
        }
    }, [apartment]);

    useEffect(() => { 
        fetchStats(); 
    }, [fetchStats]);

    if (loading) {
        return <div className="loading-text">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">🏘️ SecureGate</div>
                </div>
                <nav className="sidebar-nav">
                    <div className="nav-item active">
                        <span className="nav-icon">📊</span>
                        <span>Overview</span>
                    </div>
                </nav>
                <div className="sidebar-footer">
                    <div className="apartment-info">
                        <div className="apartment-name">{apartment?.name || 'Loading...'}</div>
                        <div className="apartment-address">{apartment?.address || ''}</div>
                    </div>
                    <button onClick={onLogout} className="logout-btn">🚪 Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="top-bar">
                    <h1 className="page-title">Overview</h1>
                    <div className="admin-info">{admin?.name}</div>
                </div>
                <div className="content">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🏠</div>
                            <div className="stat-info">
                                <h3>{stats.totalResidents}</h3>
                                <p>Total Residents</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">👤</div>
                            <div className="stat-info">
                                <h3>{stats.visitorsInside}</h3>
                                <p>Visitors Inside</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🚗</div>
                            <div className="stat-info">
                                <h3>{stats.vehiclesInside}</h3>
                                <p>Vehicles Inside</p>
                                <small>Total: {stats.totalVehicles}</small>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">👮</div>
                            <div className="stat-info">
                                <h3>{stats.activeGuards}</h3>
                                <p>Active Guards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;