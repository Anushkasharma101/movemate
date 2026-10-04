import React, { useState } from 'react';
import { 
  Search, Plus, Calendar, ChevronDown, MapPin, 
  Package, Shield, Building2, Wine, Laptop, 
  AlertCircle, CheckCircle2, UserX, Clock
} from 'lucide-react';

export default function AdminMoveRequests({ 
  onAssignTeam,
  onOpenNewMoveModal
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedMoveId, setSelectedMoveId] = useState('MM-1042');

  const requests = [
    {
      id: 'MM-1042',
      customer: 'Priya Sharma',
      date: '4 Oct 2026',
      fullDate: '4 October 2026',
      status: 'New',
      badgeClass: 'new',
      pickup: 'Kothrud, Pune 411038',
      drop: 'Viman Nagar, Pune 411014',
      inventory: '2 BHK • ~42 items',
      instructions: {
        access: 'Gated society, security approval',
        lift: '5th floor - Lift available',
        fragile: 'Yes (glassware, artwork)',
        electronics: 'Yes (2 monitors, 1 laptop)',
        exclude: 'Plants and personal documents',
        customerUnavailable: 'Flexible timing, neighbor will hand over key'
      }
    },
    {
      id: 'MM-1041',
      customer: 'Arjun Nair',
      date: '4 Oct 2026',
      fullDate: '4 October 2026',
      status: 'New',
      badgeClass: 'new',
      pickup: 'Aundh, Pune 411007',
      drop: 'Baner, Pune 411045',
      inventory: '1 BHK • ~28 items',
      instructions: {
        access: 'Standard society entrance',
        lift: '2nd floor - Stairs only',
        fragile: 'Yes (ceramic dinnerware)',
        electronics: '1 Desktop PC, 55" TV',
        exclude: 'Jewelry and cash',
        customerUnavailable: 'Customer present during loading'
      }
    },
    {
      id: 'MM-1039',
      customer: 'Meera Iyer',
      date: '5 Oct 2026',
      fullDate: '5 October 2026',
      status: 'Pending',
      badgeClass: 'pending',
      pickup: 'Kalyani Nagar, Pune 411006',
      drop: 'Magarpatta City, Pune 411028',
      inventory: '3 BHK • ~65 items',
      instructions: {
        access: 'Visitor pass required at gate',
        lift: '11th floor - Service lift booked',
        fragile: 'Yes (Pooja unit & idols, chandelier)',
        electronics: 'Home theater system, 2 Laptops',
        exclude: 'Perishables from refrigerator',
        customerUnavailable: 'Requires evening slot after 4 PM'
      }
    },
    {
      id: 'MM-1038',
      customer: 'Rohit Kulkarni',
      date: '6 Oct 2026',
      fullDate: '6 October 2026',
      status: 'Assigned',
      badgeClass: 'assigned',
      pickup: 'Wakad, Pune 411057',
      drop: 'Hinjawadi Phase 1, Pune 411057',
      inventory: '2 BHK • ~38 items',
      instructions: {
        access: 'Clear driveway for truck parking',
        lift: '3rd floor - Lift available',
        fragile: 'Glass coffee table & mirrors',
        electronics: 'Gaming PC setup, Dual screens',
        exclude: 'Pet supplies',
        customerUnavailable: 'Full day slot confirmed'
      }
    },
    {
      id: 'MM-1037',
      customer: 'Sneha Joshi',
      date: '6 Oct 2026',
      fullDate: '6 October 2026',
      status: 'New',
      badgeClass: 'new',
      pickup: 'Model Colony, Pune 411016',
      drop: 'Bavdhan, Pune 411021',
      inventory: '2 BHK • ~35 items',
      instructions: {
        access: 'Narrow lane entrance',
        lift: '1st floor - Lift available',
        fragile: 'Kitchen ceramics',
        electronics: '1 Smart TV, 1 iMac',
        exclude: 'Important documents folder',
        customerUnavailable: 'Available from 10 AM'
      }
    },
    {
      id: 'MM-1036',
      customer: 'Karan Deshpande',
      date: '7 Oct 2026',
      fullDate: '7 October 2026',
      status: 'Pending',
      badgeClass: 'pending',
      pickup: 'Shivajinagar, Pune 411005',
      drop: 'Hadapsar, Pune 411028',
      inventory: '3 BHK • ~52 items',
      instructions: {
        access: 'Security gate clearance done',
        lift: '4th floor - Passenger lift only',
        fragile: 'Antique wooden clock & crystal set',
        electronics: 'Large refrigerator, Washing machine',
        exclude: 'Valuables',
        customerUnavailable: 'Wife will supervise unloading'
      }
    },
    {
      id: 'MM-1035',
      customer: 'Anjali Raut',
      date: '7 Oct 2026',
      fullDate: '7 October 2026',
      status: 'Assigned',
      badgeClass: 'assigned',
      pickup: 'Pimple Saudagar, Pune 411027',
      drop: 'Ravet, Pune 412101',
      inventory: '1.5 BHK • ~30 items',
      instructions: {
        access: 'Basement parking clearance',
        lift: '7th floor - Lift available',
        fragile: 'None',
        electronics: '1 Workstation',
        exclude: 'None',
        customerUnavailable: 'Morning slot preferred'
      }
    },
    {
      id: 'MM-1034',
      customer: 'Vivek Pande',
      date: '8 Oct 2026',
      fullDate: '8 October 2026',
      status: 'New',
      badgeClass: 'new',
      pickup: 'Koregaon Park, Pune 411001',
      drop: 'Kharadi, Pune 411014',
      inventory: '2 BHK • ~45 items',
      instructions: {
        access: 'Gated villa society',
        lift: 'Ground floor only',
        fragile: 'Designer glass dining table',
        electronics: 'Sound bar, 65" OLED TV',
        exclude: 'Indoor plants',
        customerUnavailable: 'Will coordinate via WhatsApp'
      }
    }
  ];

  // Filtering
  const filteredRequests = requests.filter((req) => {
    // Tab filter
    if (activeTab === 'New' && req.status !== 'New') return false;
    if (activeTab === 'Pending' && req.status !== 'Pending') return false;
    if (activeTab === 'Assigned' && req.status !== 'Assigned') return false;
    if (activeTab === 'Completed' && req.status !== 'Completed') return false;

    // Status dropdown
    if (selectedStatusFilter !== 'All' && req.status !== selectedStatusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = req.id.toLowerCase().includes(q);
      const matchCustomer = req.customer.toLowerCase().includes(q);
      const matchLoc = req.pickup.toLowerCase().includes(q) || req.drop.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchLoc) return false;
    }

    return true;
  });

  const selectedMove = requests.find((r) => r.id === selectedMoveId) || requests[0];

  return (
    <div className="admin-move-requests-view">
      {/* View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <h1>Move requests</h1>
          <p>Review new move requests, check details and assign a coordinator.</p>
        </div>
        <div className="admin-view-header-right">
          <button 
            type="button" 
            className="admin-btn-dark-green"
            onClick={onOpenNewMoveModal}
          >
            <Plus size={18} />
            <span>New move request</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-tab-filter-row">
        {[
          { id: 'All', count: 28 },
          { id: 'New', count: 8 },
          { id: 'Pending', count: 5 },
          { id: 'Assigned', count: 12 },
          { id: 'Completed', count: 3 }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-filter-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search & Toolbars */}
      <div className="admin-search-toolbar">
        <div className="admin-search-input-box">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by customer, ID or location..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="admin-dropdown-select-btn"
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
          >
            <span>{selectedStatusFilter === 'All' ? 'All status' : selectedStatusFilter}</span>
            <ChevronDown size={14} />
          </button>

          {filterDropdownOpen && (
            <div className="admin-dropdown-menu" style={{ width: '160px' }}>
              {['All', 'New', 'Pending', 'Assigned', 'Completed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className="admin-dropdown-item"
                  onClick={() => {
                    setSelectedStatusFilter(st);
                    setFilterDropdownOpen(false);
                  }}
                >
                  {st === 'All' ? 'All status' : st}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="admin-dropdown-select-btn">
          <span>Pick update</span>
          <Calendar size={14} />
        </button>
      </div>

      {/* 2-Column Split Layout */}
      <div className="admin-split-layout">
        
        {/* Left Column: Move Requests List Table */}
        <div className="admin-left-list-card">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Move date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const isSelected = selectedMoveId === req.id;
                return (
                  <tr 
                    key={req.id}
                    className={`admin-clickable-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedMoveId(req.id)}
                  >
                    <td className="admin-move-id">{req.id}</td>
                    <td className="admin-customer-name">{req.customer}</td>
                    <td>{req.date}</td>
                    <td>
                      <span className={`admin-badge ${req.badgeClass}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column: Selected Move Details Card */}
        {selectedMove && (
          <div className="admin-detail-card">
            <div className="admin-detail-card-header">
              <div>
                <h3 className="admin-detail-card-title">{selectedMove.id}</h3>
                <span className="admin-detail-card-sub">{selectedMove.customer}</span>
              </div>
              <span className={`admin-badge ${selectedMove.badgeClass}`}>
                {selectedMove.status}
              </span>
            </div>

            {/* Core Details List */}
            <div className="admin-detail-info-list">
              <div className="admin-detail-info-item">
                <MapPin className="item-icon" />
                <div>
                  <strong>Pickup</strong>
                  <span>{selectedMove.pickup}</span>
                </div>
              </div>

              <div className="admin-detail-info-item">
                <MapPin className="item-icon" />
                <div>
                  <strong>Drop</strong>
                  <span>{selectedMove.drop}</span>
                </div>
              </div>

              <div className="admin-detail-info-item">
                <Calendar className="item-icon" />
                <div>
                  <strong>Move date</strong>
                  <span>{selectedMove.fullDate}</span>
                </div>
              </div>

              <div className="admin-detail-info-item">
                <Package className="item-icon" />
                <div>
                  <strong>Inventory</strong>
                  <span>{selectedMove.inventory}</span>
                </div>
              </div>
            </div>

            {/* Access & Special Instructions */}
            <div className="admin-instructions-section">
              <h4 className="admin-instructions-title">Access & special instructions</h4>
              <div className="admin-instruction-grid">
                <div className="admin-instruction-row">
                  <Shield className="instr-icon" />
                  <div>
                    <span className="admin-instruction-label">Access restriction</span>
                    <div className="admin-instruction-value">{selectedMove.instructions.access}</div>
                  </div>
                </div>

                <div className="admin-instruction-row">
                  <Building2 className="instr-icon" />
                  <div>
                    <span className="admin-instruction-label">Floor / Lift</span>
                    <div className="admin-instruction-value">{selectedMove.instructions.lift}</div>
                  </div>
                </div>

                <div className="admin-instruction-row">
                  <Wine className="instr-icon" />
                  <div>
                    <span className="admin-instruction-label">Fragile items</span>
                    <div className="admin-instruction-value">{selectedMove.instructions.fragile}</div>
                  </div>
                </div>

                <div className="admin-instruction-row">
                  <Laptop className="instr-icon" />
                  <div>
                    <span className="admin-instruction-label">Monitor / Laptop</span>
                    <div className="admin-instruction-value">{selectedMove.instructions.electronics}</div>
                  </div>
                </div>

                <div className="admin-instruction-row">
                  <Package className="instr-icon" />
                  <div>
                    <span className="admin-instruction-label">Items to exclude</span>
                    <div className="admin-instruction-value">{selectedMove.instructions.exclude}</div>
                  </div>
                </div>

                <div className="admin-instruction-row">
                  <UserX className="instr-icon" />
                  <div>
                    <span className="admin-instruction-label">Customer notes</span>
                    <div className="admin-instruction-value">{selectedMove.instructions.customerUnavailable}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Bottom CTA Actions */}
            <div className="admin-card-actions">
              <button 
                type="button" 
                className="admin-btn-secondary"
                onClick={() => alert(`Reviewing full details for ${selectedMove.id} (${selectedMove.customer})`)}
              >
                Review details
              </button>

              <button 
                type="button" 
                className="admin-btn-coral"
                onClick={() => onAssignTeam(selectedMove)}
              >
                Assign coordinator
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
