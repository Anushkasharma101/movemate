import React from 'react';
import { 
  ClipboardList, FileText, FileSpreadsheet, 
  AlertTriangle, ArrowRight, ShieldAlert 
} from 'lucide-react';

export default function AdminOverview({ 
  onNavigateTab, 
  onSelectMoveForAssign 
}) {
  const stats = [
    {
      id: 'coordinators',
      number: '12',
      title: 'Pending applications',
      subtitle: 'Coordinator applications',
      color: 'orange',
      icon: ClipboardList,
      targetTab: 'coordinators'
    },
    {
      id: 'new_requests',
      number: '8',
      title: 'New move requests',
      subtitle: 'Needs review',
      color: 'green',
      icon: FileText,
      targetTab: 'move_requests'
    },
    {
      id: 'unassigned',
      number: '3',
      title: 'Unassigned moves',
      subtitle: 'Awaiting assignment',
      color: 'pink',
      icon: FileSpreadsheet,
      targetTab: 'move_requests'
    },
    {
      id: 'incidents',
      number: '2',
      title: 'Open incidents',
      subtitle: 'Require attention',
      color: 'blue',
      icon: AlertTriangle,
      targetTab: 'incidents'
    }
  ];

  const upcomingMoves = [
    {
      id: 'MM-1042',
      customer: 'Priya Sharma',
      date: '4 Oct 2026',
      coordinator: 'Rahul Mehta',
      status: 'Assigned',
      badgeClass: 'assigned'
    },
    {
      id: 'MM-1043',
      customer: 'Karan Deshpande',
      date: '5 Oct 2026',
      coordinator: 'Unassigned',
      status: 'Unassigned',
      badgeClass: 'unassigned'
    },
    {
      id: 'MM-1044',
      customer: 'Neha Kulkarni',
      date: '5 Oct 2026',
      coordinator: 'Sneha Patil',
      status: 'Confirmed',
      badgeClass: 'confirmed'
    },
    {
      id: 'MM-1045',
      customer: 'Amit Jadhav',
      date: '6 Oct 2026',
      coordinator: 'Vikram Singh',
      status: 'Assigned',
      badgeClass: 'assigned'
    },
    {
      id: 'MM-1046',
      customer: 'Rohan Bhat',
      date: '7 Oct 2026',
      coordinator: 'Unassigned',
      status: 'Unassigned',
      badgeClass: 'unassigned'
    }
  ];

  return (
    <div className="admin-overview-view">
      {/* View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h1>Good morning, Admin</h1>
          <p>Here's what needs your attention today.</p>
        </div>
        <div className="admin-view-header-right">
          <div className="admin-header-location-date">
            <strong>4 October 2026</strong>
            <span>Pune</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="admin-stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.id} 
              className="admin-stat-card"
              onClick={() => onNavigateTab(stat.targetTab)}
            >
              <div className={`admin-stat-icon-wrap ${stat.color}`}>
                <Icon size={26} />
              </div>
              <div className="admin-stat-content">
                <span className="admin-stat-number">{stat.number}</span>
                <span className="admin-stat-title">{stat.title}</span>
                <span className="admin-stat-subtitle">{stat.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Moves Section */}
      <div className="admin-table-section">
        <div className="admin-table-header-row">
          <h2 className="admin-table-heading">Upcoming moves</h2>
          <button 
            type="button" 
            className="admin-view-all-link"
            onClick={() => onNavigateTab('move_requests')}
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Move ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Coordinator</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {upcomingMoves.map((move) => (
              <tr 
                key={move.id} 
                className="admin-clickable-row"
                onClick={() => {
                  if (move.status === 'Unassigned') {
                    if (onSelectMoveForAssign) onSelectMoveForAssign(move);
                  } else {
                    onNavigateTab('move_requests');
                  }
                }}
                title={move.status === 'Unassigned' ? 'Click to assign team' : 'View move details'}
              >
                <td className="admin-move-id">{move.id}</td>
                <td className="admin-customer-name">{move.customer}</td>
                <td>{move.date}</td>
                <td>{move.coordinator}</td>
                <td>
                  <span className={`admin-badge ${move.badgeClass}`}>
                    {move.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
