import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../services/supabase';

const API_URL = process.env.REACT_APP_API_URL;

function ResidentsTable({ apartmentId }) {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newResident, setNewResident] = useState({ flat_number: '', name: '', phone: '', email: '', vehicle_number: '' });
    const [qrData, setQrData] = useState(null);

    const fetchResidents = async () => {
        const token = await getAccessToken();
        try {
            const response = await axios.get(`${API_URL}/api/admin/${apartmentId}/residents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResidents(response.data.residents || []);
        } catch (err) {
            console.error('Error fetching residents:', err);
        } finally {
            setLoading(false);
        }
    };

    const createResident = async () => {
        const token = await getAccessToken();
        try {
            const response = await axios.post(`${API_URL}/api/admin/${apartmentId}/residents`, newResident, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Resident added successfully!');
            setShowModal(false);
            setNewResident({ flat_number: '', name: '', phone: '', email: '', vehicle_number: '' });
            fetchResidents();
        } catch (err) {
            alert('Failed to create resident');
        }
    };

    const deleteResident = async (residentId) => {
    // ✅ Fix: Use window.confirm instead of confirm
    if (window.confirm('Delete this resident?')) {
        const token = await getAccessToken();
        try {
            await axios.delete(`${API_URL}/api/admin/${apartmentId}/residents/${residentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchResidents();
        } catch (err) {
            alert('Failed to delete resident');
        }
    }
};

    const generateQR = async (residentId) => {
        const token = await getAccessToken();
        try {
            const response = await axios.post(`${API_URL}/api/admin/${apartmentId}/residents/${residentId}/generate-qr`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setQrData(response.data);
        } catch (err) {
            alert('Failed to generate QR');
        }
    };

    useEffect(() => {
        if (apartmentId) fetchResidents();
    }, [apartmentId]);

    const filteredResidents = residents.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phone.includes(searchTerm)
    );

    if (loading) return <div className="loading-text">Loading residents...</div>;

    return (
        <div>
            <div className="tab-header">
                <h2>Residents</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Resident</button>
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search by name, flat, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="table-container">
                <table className="data-table">
                    <thead><tr><th>Flat</th><th>Name</th><th>Phone</th><th>Vehicle</th><th>QR Code</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filteredResidents.map(resident => (
                            <tr key={resident.id}>
                                <td>{resident.flat_number}</td>
                                <td>{resident.name}</td>
                                <td>{resident.phone}</td>
                                <td>{resident.vehicle_number || '-'}</td>
                                <td>
                                    {resident.qr_code_url ?
                                        <button className="btn-success" onClick={() => setQrData({ qr_code_url: resident.qr_code_url, name: resident.name, flat_number: resident.flat_number })}>View QR</button> :
                                        <button className="btn-primary" onClick={() => generateQR(resident.id)}>Generate QR</button>
                                    }
                                </td>
                                <td><button className="btn-danger" onClick={() => deleteResident(resident.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal" style={{display: 'flex'}}>
                    <div className="modal-content">
                        <div className="modal-header"><h3>Add New Resident</h3><span className="close" onClick={() => setShowModal(false)}>&times;</span></div>
                        <div className="modal-body">
                            <input type="text" placeholder="Flat Number" value={newResident.flat_number} onChange={(e) => setNewResident({...newResident, flat_number: e.target.value})} />
                            <input type="text" placeholder="Full Name" value={newResident.name} onChange={(e) => setNewResident({...newResident, name: e.target.value})} />
                            <input type="tel" placeholder="Phone Number" value={newResident.phone} onChange={(e) => setNewResident({...newResident, phone: e.target.value})} />
                            <input type="email" placeholder="Email (Optional)" value={newResident.email} onChange={(e) => setNewResident({...newResident, email: e.target.value})} />
                            <input type="text" placeholder="Vehicle Number (Optional)" value={newResident.vehicle_number} onChange={(e) => setNewResident({...newResident, vehicle_number: e.target.value})} />
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={createResident}>Add Resident</button>
                        </div>
                    </div>
                </div>
            )}

            {qrData && (
                <div className="modal" style={{display: 'flex'}}>
                    <div className="modal-content small">
                        <div className="modal-header"><h3>QR Code</h3><span className="close" onClick={() => setQrData(null)}>&times;</span></div>
                        <div className="modal-body" style={{textAlign: 'center'}}>
                            <img src={qrData.qr_code_url} style={{width: '200px', height: '200px'}} alt="QR Code" />
                            <p>{qrData.name}</p>
                            <p>Flat: {qrData.flat_number}</p>
                            <button className="btn-primary" onClick={() => window.open(qrData.qr_code_url, '_blank')}>🖨️ Print</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResidentsTable;