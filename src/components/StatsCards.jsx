import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../services/supabase';

const API_URL = process.env.REACT_APP_API_URL;

function StatsCards({ apartmentId }) {
    const [stats, setStats] = useState({ totalResidents: 0, visitorsInside: 0, vehiclesInside: 0, totalVehicles: 0, activeGuards: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!apartmentId) return;
            const token = await getAccessToken();
            try {
                const response = await axios.get(`${API_URL}/api/admin/${apartmentId}/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.success) setStats(response.data.stats);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchStats();
    }, [apartmentId]);

    if (loading) return <div className="loading-text">Loading stats...</div>;

    const cards = [
        { icon: '🏠', value: stats.totalResidents, label: 'Total Residents' },
        { icon: '👤', value: stats.visitorsInside, label: 'Visitors Inside' },
        { icon: '🚗', value: stats.vehiclesInside, label: 'Vehicles Inside', sub: `Total: ${stats.totalVehicles}` },
        { icon: '👮', value: stats.activeGuards, label: 'Active Guards' }
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, index) => (
                <div key={index} className="stat-card">
                    <div className="stat-icon">{card.icon}</div>
                    <div className="stat-info">
                        <h3>{card.value}</h3>
                        <p>{card.label}</p>
                        {card.sub && <small>{card.sub}</small>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StatsCards;
