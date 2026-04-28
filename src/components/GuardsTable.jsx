import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../services/supabase';

const API_URL = process.env.REACT_APP_API_URL;

function GuardsTable({ apartmentId }) {
    const [guards, setGuards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newGuard, setNewGuard] = useState({ name: '', email: '', phone: '', shift: 'morning', password: '' });

    const fetchGuards = async () => {
        const token = await getAccessToken();
        try {
            const response = await axios.get(`${API_URL}/api/admin/${apartmentId}/guards`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setGuards(response.data.guards || []);
        } catch (err) {
            console.error('Error fetching guards:', err);
        } finally {
            setLoading(false);
        }
    };

    const createGuard = async () => {
        const token = await getAccessToken();
        try {
            await axios.post(`${API_URL}/api/admin/${apartmentId}/guards`, newGuard, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Guard added successfully!');
            setShowModal(false);
            setNewGuard({ name: '', email: '', phone: '', shift: 'morning', password: '' });
            fetchGuards();
        } catch (err) {
            alert('Failed to create guard');
        }
    };

    const deleteGuard = async (guardId) => {
        if (!confirm('Remove this guard?')) return;
        const token = await getAccessToken();
        try {
            await axios.delete(`${API_URL}/api/admin/${apartmentId}/guards/${guardId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchGuards();
        } catch (err) {
            alert('Failed to delete guard');
        }
    };

    useEffect(() => {
        if (apartmentId) fetchGuards();
    }, [apartmentId]);

    if (loading) return <div className="loading-text">Loading guards...</div>;

    return (
        <div>
            <div className="tab-header">
                <h2>Security Guards</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add New Guard</button>
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Phone</th><th>Shift</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {guards.map(guard => (
                            <tr key={guard.id}>
                                <td>{guard.name}</td>
                                <td>{guard.email}</td>
                                <td>{guard.phone || '-'}</td>
                                <td>{guard.shift === 'morning' ? '🌅 Morning' : guard.shift === 'evening' ? '🌙 Evening' : '🌃 Night'}</td>
                                <td>{guard.is_active ? <span style={{color: '#51cf66'}}>✅ Active</span> : <span style={{color: '#ff6b6b'}}>❌ Inactive</span>}</td>
                                <td><button className="btn-danger" onClick={() => deleteGuard(guard.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal" style={{display: 'flex'}}>
                    <div className="modal-content">
                        <div className="modal-header"><h3>Add New Guard</h3><span className="close" onClick={() => setShowModal(false)}>&times;</span></div>
                        <div className="modal-body">
                            <input type="text" placeholder="Full Name" value={newGuard.name} onChange={(e) => setNewGuard({...newGuard, name: e.target.value})} />
                            <input type="email" placeholder="Email" value={newGuard.email} onChange={(e) => setNewGuard({...newGuard, email: e.target.value})} />
                            <input type="tel" placeholder="Phone" value={newGuard.phone} onChange={(e) => setNewGuard({...newGuard, phone: e.target.value})} />
                            <select value={newGuard.shift} onChange={(e) => setNewGuard({...newGuard, shift: e.target.value})}>
                                <option value="morning">Morning (6 AM - 2 PM)</option>
                                <option value="evening">Evening (2 PM - 10 PM)</option>
                                <option value="night">Night (10 PM - 6 AM)</option>
                            </select>
                            <input type="password" placeholder="Temporary Password" value={newGuard.password} onChange={(e) => setNewGuard({...newGuard, password: e.target.value})} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={createGuard}>Add Guard</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GuardsTable;