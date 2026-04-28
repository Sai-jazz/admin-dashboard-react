import React from 'react';

function StatsCards({ stats }) {
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