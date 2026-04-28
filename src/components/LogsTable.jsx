import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../services/supabase';

const API_URL = process.env.REACT_APP_API_URL;

function LogsTable({ apartmentId }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const fetchLogs = async () => {
        const token = await getAccessToken();
        try {
            const response = await axios.get(`${API_URL}/api/admin/${apartmentId}/logs?limit=200`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setLogs(response.data.logs || []);
        } catch (err) {
            console.error('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (apartmentId) fetchLogs();
    }, [apartmentId]);

    const filteredLogs = logs.filter(log => {
        if (dateFilter && new Date(log.entry_time).toISOString().split('T')[0] !== dateFilter) return false;
        if (typeFilter && log.entry_type !== typeFilter) return false;
        return true;
    });

    const exportCSV = () => {
        const csv = [
            ['Date', 'Type', 'Name', 'Flat', 'Vehicle', 'Entry Method', 'Exit Time'],
            ...filteredLogs.map(log => [
                new Date(log.entry_time).toLocaleString(),
                log.entry_type,
                log.person_name,
                log.flat_number,
                log.vehicle_number || '',
                log.entry_method,
                log.exit_time ? new Date(log.exit_time).toLocaleString() : 'Still inside'
            ])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) return <div className="loading-text">Loading logs...</div>;

    return (
        <div>
            <div className="tab-header"><h2>Activity Logs</h2></div>
            <div className="filter-bar">
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="resident">Residents</option>
                    <option value="visitor">Visitors</option>
                </select>
                <button className="btn-secondary" onClick={exportCSV}>📥 Export CSV</button>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead><tr><th>Date & Time</th><th>Type</th><th>Name</th><th>Flat</th><th>Vehicle</th><th>Entry Method</th><th>Exit Time</th></tr></thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id}>
                                <td>{new Date(log.entry_time).toLocaleString()}</td>
                                <td>{log.entry_type === 'resident' ? '🏠 Resident' : '👤 Visitor'}</td>
                                <td>{log.person_name}</td>
                                <td>{log.flat_number}</td>
                                <td>{log.vehicle_number || '-'}</td>
                                <td>{log.entry_method === 'qr' ? '📷 QR' : log.entry_method === 'vehicle' ? '🚗 Vehicle' : '📝 Form'}</td>
                                <td>{log.exit_time ? new Date(log.exit_time).toLocaleTimeString() : 'Still inside'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LogsTable;