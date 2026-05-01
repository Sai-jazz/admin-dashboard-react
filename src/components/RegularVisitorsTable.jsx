import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../services/supabase';

const API_URL = process.env.REACT_APP_API_URL;

function RegularVisitorsTable({ apartmentId }) {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newVisitor, setNewVisitor] = useState({ name: '', phone: '', email: '', purpose: '', days: [], visit_time: '' });
    const [daysOptions] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

    const fetchVisitors = async () => {
        const token = await getAccessToken();
        try {
            const response = await axios.get(`${API_URL}/api/apartments/${apartmentId}/regular-visitors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setVisitors(response.data.visitors || []);
        } catch (err) {
            console.error('Error fetching regular visitors:', err);
        } finally {
            setLoading(false);
        }
    };

    const createVisitor = async () => {
        const token = await getAccessToken();
        try {
            await axios.post(`${API_URL}/api/apartments/${apartmentId}/regular-visitors`, newVisitor, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Regular visitor added successfully!');
            setShowModal(false);
            setNewVisitor({ name: '', phone: '', email: '', purpose: '', days: [], visit_time: '' });
            fetchVisitors();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create regular visitor');
        }
    };

    const deleteVisitor = async (visitorId) => {
        // ✅ Fix: Use window.confirm instead of confirm
        if (window.confirm('Delete this regular visitor?')) {
            const token = await getAccessToken();
            try {
                await axios.delete(`${API_URL}/api/apartments/${apartmentId}/regular-visitors/${visitorId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchVisitors();
            } catch (err) {
                alert('Failed to delete regular visitor');
            }
        }
    };

    const toggleDay = (day) => {
        setNewVisitor(prev => ({
            ...prev,
            days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
        }));
    };

    useEffect(() => {
        if (apartmentId) fetchVisitors();
    }, [apartmentId]);

    if (loading) return <div className="loading-text">Loading regular visitors...</div>;

    return (
        <div>
            <div className="tab-header">
                <h2>Regular Visitors</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Regular Visitor</button>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr><th>Name</th><th>Phone</th><th>Purpose</th><th>Visit Days</th><th>Visit Time</th><th>Total Visits</th><th>Last Visit</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {visitors.map(visitor => (
                            <tr key={visitor.id}>
                                <td>{visitor.name}</td>
                                <td>{visitor.phone}</td>
                                <td>{visitor.purpose || '-'}</td>
                                <td>{visitor.days?.join(', ') || '-'}</td>
                                <td>{visitor.visit_time || '-'}</td>
                                <td>{visitor.total_visits || 0}</td>
                                <td>{visitor.last_visit ? new Date(visitor.last_visit).toLocaleDateString() : '-'}</td>
                                <td><button className="btn-danger" onClick={() => deleteVisitor(visitor.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal" style={{display: 'flex'}}>
                    <div className="modal-content">
                        <div className="modal-header"><h3>Add Regular Visitor</h3><span className="close" onClick={() => setShowModal(false)}>&times;</span></div>
                        <div className="modal-body">
                            <input type="text" placeholder="Name *" value={newVisitor.name} onChange={(e) => setNewVisitor({...newVisitor, name: e.target.value})} />
                            <input type="tel" placeholder="Phone *" value={newVisitor.phone} onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})} />
                            <input type="email" placeholder="Email (Optional)" value={newVisitor.email} onChange={(e) => setNewVisitor({...newVisitor, email: e.target.value})} />
                            <input type="text" placeholder="Purpose (e.g., Milk delivery, Newspaper)" value={newVisitor.purpose} onChange={(e) => setNewVisitor({...newVisitor, purpose: e.target.value})} />
                            <div className="days-selector">
                                <label>Visit Days:</label>
                                <div className="days-buttons">
                                    {daysOptions.map(day => (
                                        <button key={day} type="button" className={`day-btn ${newVisitor.days.includes(day) ? 'active' : ''}`} onClick={() => toggleDay(day)}>{day.slice(0,3)}</button>
                                    ))}
                                </div>
                            </div>
                            <input type="time" placeholder="Visit Time" value={newVisitor.visit_time} onChange={(e) => setNewVisitor({...newVisitor, visit_time: e.target.value})} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={createVisitor}>Add Visitor</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegularVisitorsTable;