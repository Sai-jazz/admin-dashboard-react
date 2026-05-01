import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { getAccessToken } from '../services/supabase';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const API_URL = process.env.REACT_APP_API_URL;

function AnalyticsCharts({ apartmentId }) {
    const [trends, setTrends] = useState({});
    const [methods, setMethods] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!apartmentId) return;
            const token = await getAccessToken();
            try {
                const [trendsRes, methodsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/admin/${apartmentId}/trends?days=7`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    axios.get(`${API_URL}/api/admin/${apartmentId}/entry-methods`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                setTrends(trendsRes.data.trends || {});
                setMethods(methodsRes.data.methods || {});
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [apartmentId]);

    const trendData = {
        labels: Object.keys(trends),
        datasets: [{ label: 'Entries', data: Object.values(trends), borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.1)', tension: 0.4, fill: true }]
    };

    const methodData = {
        labels: ['QR Code', 'Vehicle Number', 'Visitor Form', 'Manual'],
        datasets: [{ data: [methods.qr || 0, methods.vehicle || 0, methods.visitor_form || 0, methods.manual || 0], backgroundColor: ['#00ff88', '#1e3c72', '#ffc107', '#6c757d'] }]
    };

    if (loading) return <div className="loading-text">Loading charts...</div>;

    return (
        <div className="charts-row">
            <div className="chart-card">
                <h3>Visitor Trends (Last 7 Days)</h3>
                <Line data={trendData} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#888' } } }, scales: { y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
            </div>
            <div className="chart-card">
                <h3>Entry Methods</h3>
                <Pie data={methodData} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#888' } } } }} />
            </div>
        </div>
    );
}

export default AnalyticsCharts;