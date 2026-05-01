import React from 'react';

function Sidebar({ activeTab, setActiveTab, apartment, admin, onLogout }) {
    const navItems = [
        { id: 'overview', icon: '📊', label: 'Overview' },
        { id: 'guards', icon: '👮', label: 'Guards' },
        { id: 'residents', icon: '🏠', label: 'Residents' },
        { id: 'regular', icon: '⭐', label: 'Regular Visitors' },
        { id: 'logs', icon: '📋', label: 'Activity Logs' },
        { id: 'analytics', icon: '📈', label: 'Analytics' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo">🏘️ SecureGate</div>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="apartment-info">
                    <div className="apartment-name">{apartment?.name || 'Loading...'}</div>
                    <div className="apartment-address">{apartment?.address || ''}</div>
                </div>
                <button onClick={onLogout} className="logout-btn">🚪 Logout</button>
            </div>
        </div>
    );
}

export default Sidebar;