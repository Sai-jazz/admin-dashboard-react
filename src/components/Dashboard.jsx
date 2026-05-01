import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import StatsCards from './StatsCards';
import GuardsTable from './GuardsTable';
import ResidentsTable from './ResidentsTable';
import LogsTable from './LogsTable';
import AnalyticsCharts from './AnalyticsCharts';
import RegularVisitorsTable from './RegularVisitorsTable';

function Dashboard({ admin, apartment, onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="dashboard-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} apartment={apartment} admin={admin} onLogout={onLogout} />
            <div className="main-content">
                <div className="top-bar">
                    <h1 className="page-title">
                        {activeTab === 'overview' && 'Overview'}
                        {activeTab === 'guards' && 'Guard Management'}
                        {activeTab === 'residents' && 'Resident Management'}
                        {activeTab === 'regular' && 'Regular Visitors'}
                        {activeTab === 'logs' && 'Activity Logs'}
                        {activeTab === 'analytics' && 'Analytics'}
                    </h1>
                    <div className="admin-info">{admin?.name}</div>
                </div>
                <div className="content">
                    {activeTab === 'overview' && <StatsCards apartmentId={apartment?.id} />}
                    {activeTab === 'guards' && <GuardsTable apartmentId={apartment?.id} />}
                    {activeTab === 'residents' && <ResidentsTable apartmentId={apartment?.id} />}
                    {activeTab === 'regular' && <RegularVisitorsTable apartmentId={apartment?.id} />}
                    {activeTab === 'logs' && <LogsTable apartmentId={apartment?.id} />}
                    {activeTab === 'analytics' && <AnalyticsCharts apartmentId={apartment?.id} />}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;