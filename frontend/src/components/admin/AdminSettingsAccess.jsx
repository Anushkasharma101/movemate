import React, { useState } from 'react';
import { 
  Check, Info, ArrowRight, ShieldCheck, 
  Lock, Bell, FileText, Sliders 
} from 'lucide-react';

export default function AdminSettingsAccess({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('User roles');
  const [restrictDocAccess, setRestrictDocAccess] = useState(true);

  const permissions = [
    {
      name: 'View move requests',
      operations: true,
      reviewer: true,
      admin: true
    },
    {
      name: 'Assign coordinators',
      operations: true,
      reviewer: true,
      admin: true
    },
    {
      name: 'Manage vehicles and workers',
      operations: true,
      reviewer: false,
      admin: true
    },
    {
      name: 'Manage quotes',
      operations: true,
      reviewer: true,
      admin: true
    },
    {
      name: 'Handle incidents',
      operations: true,
      reviewer: true,
      admin: true
    },
    {
      name: 'Manage settings',
      operations: false,
      reviewer: false,
      admin: true
    }
  ];

  const auditLogs = [
    {
      time: '4 Oct 2026, 9:12 AM',
      user: 'Priya S.',
      action: 'Changed assignment for MM-1042'
    },
    {
      time: '3 Oct 2026, 6:44 PM',
      user: 'Rahul K.',
      action: 'Updated quote for MM-1038'
    },
    {
      time: '2 Oct 2026, 11:30 AM',
      user: 'Admin',
      action: 'Approved coordinator application (Sneha P.)'
    }
  ];

  const handleSaveChanges = () => {
    if (onShowToast) {
      onShowToast('Settings and access control updated successfully!');
    } else {
      alert('Settings saved.');
    }
  };

  return (
    <div className="admin-settings-access-view" style={{ maxWidth: '960px' }}>
      {/* View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h1>Settings and access</h1>
          <p>Manage roles, permissions, notifications and system settings.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tab-filter-row">
        {[
          'User roles',
          'Notifications',
          'Policies',
          'Audit log',
          'Document access'
        ].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-filter-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SECTION 1: ROLE PERMISSIONS TABLE */}
      <div className="admin-section-block">
        <h3 className="admin-instructions-title" style={{ fontSize: '1rem', marginBottom: '14px' }}>
          Role permissions
        </h3>

        <div className="admin-table-section" style={{ padding: '8px 20px' }}>
          <table className="admin-permissions-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th>Operations</th>
                <th>Reviewer</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, idx) => (
                <tr key={idx}>
                  <td>{perm.name}</td>
                  <td>
                    {perm.operations ? (
                      <span className="admin-perm-check">✓</span>
                    ) : (
                      <span className="admin-perm-dash">—</span>
                    )}
                  </td>
                  <td>
                    {perm.reviewer ? (
                      <span className="admin-perm-check">✓</span>
                    ) : (
                      <span className="admin-perm-dash">—</span>
                    )}
                  </td>
                  <td>
                    {perm.admin ? (
                      <span className="admin-perm-check">✓</span>
                    ) : (
                      <span className="admin-perm-dash">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: RECENT CHANGES (AUDIT LOG) */}
      <div className="admin-section-block">
        <div className="admin-section-block-header">
          <h3 className="admin-instructions-title" style={{ fontSize: '1rem', margin: 0 }}>
            Recent changes (audit log)
          </h3>
          <button 
            type="button" 
            className="admin-view-all-link"
            onClick={() => setActiveTab('Audit log')}
          >
            <span>View all</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="admin-table-section" style={{ padding: '8px 20px' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Date & time</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ color: '#537168' }}>{log.time}</td>
                  <td><strong>{log.user}</strong></td>
                  <td style={{ color: '#1f3c35' }}>{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: IDENTITY DOCUMENT ACCESS */}
      <div className="admin-doc-access-box">
        <div className="admin-doc-access-header">
          <span>Identity document access</span>
          <Info size={16} color="#637f77" />
        </div>
        <p className="admin-doc-access-sub">
          Only admins can view full identity documents. Others can see verification status only.
        </p>

        <div className="admin-doc-access-footer">
          <label className="admin-checkbox-label">
            <input 
              type="checkbox" 
              checked={restrictDocAccess}
              onChange={(e) => setRestrictDocAccess(e.target.checked)}
            />
            <span>Restrict identity document access to Admin role only</span>
          </label>

          <button 
            type="button" 
            className="admin-btn-dark-green"
            onClick={handleSaveChanges}
          >
            Save changes
          </button>
        </div>
      </div>

    </div>
  );
}
