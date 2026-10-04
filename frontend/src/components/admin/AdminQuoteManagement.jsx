import React, { useState } from 'react';
import { 
  Plus, AlertCircle, Send, CheckCircle2, 
  X, Building2, Package, Check, RefreshCw 
} from 'lucide-react';

export default function AdminQuoteManagement({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('Quote details');
  const [costStatus, setCostStatus] = useState('Pending approval');

  const [quoteItems, setQuoteItems] = useState([
    {
      item: 'Packing materials',
      description: 'Boxes, bubble wrap, tape',
      rate: 1000,
      amount: 1000
    },
    {
      item: 'Transport',
      description: 'Tata 407 (1 day)',
      rate: 2000,
      amount: 2000
    },
    {
      item: 'Labour',
      description: '2 workers × 4 hours',
      rate: 750,
      amount: 1500
    }
  ]);

  const totalAmount = quoteItems.reduce((sum, i) => sum + i.amount, 0);

  const handleAddItem = () => {
    const newItem = {
      item: 'Fragile handling',
      description: 'Glassware & Electronics bubble encasing',
      rate: 500,
      amount: 500
    };
    setQuoteItems([...quoteItems, newItem]);
    if (onShowToast) onShowToast('Added item to quote calculation.');
  };

  const handleApproveCost = () => {
    setCostStatus('Approved');
    if (onShowToast) {
      onShowToast('Approved additional cost request of INR 300!');
    } else {
      alert('Approved INR 300 additional cost request.');
    }
  };

  const handleRejectCost = () => {
    setCostStatus('Rejected');
    if (onShowToast) {
      onShowToast('Rejected additional cost request.');
    } else {
      alert('Rejected INR 300 additional cost request.');
    }
  };

  const handleSendToCustomer = () => {
    if (onShowToast) {
      onShowToast('Quote sent to customer (Priya Sharma) via SMS and WhatsApp link!');
    } else {
      alert('Quote shared with customer for acceptance.');
    }
  };

  return (
    <div className="admin-quote-wrapper">
      {/* View Header */}
      <div className="admin-view-header">
        <div className="admin-view-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1>Quote for MM-1042</h1>
            <span className="admin-badge unassigned">Awaiting acceptance</span>
          </div>
          <p>Demo quote • 4 October 2026</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tab-filter-row">
        <button
          type="button"
          className={`admin-filter-tab ${activeTab === 'Quote details' ? 'active' : ''}`}
          onClick={() => setActiveTab('Quote details')}
        >
          Quote details
        </button>
        <button
          type="button"
          className={`admin-filter-tab ${activeTab === 'Version history' ? 'active' : ''}`}
          onClick={() => setActiveTab('Version history')}
        >
          Version history (3)
        </button>
      </div>

      {/* SECTION: ITEMS TABLE */}
      <div className="admin-section-block">
        <h3 className="admin-instructions-title" style={{ fontSize: '1rem', marginBottom: '14px' }}>
          Items
        </h3>

        <div className="admin-table-section" style={{ padding: '4px 18px 18px 18px' }}>
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Rate (INR)</th>
                <th style={{ textAlign: 'right' }}>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {quoteItems.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.item}</strong></td>
                  <td style={{ color: '#537168' }}>{item.description}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                    {item.rate.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: '600' }}>
                    {item.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Item button & Total amount display */}
          <div className="admin-quote-total-row">
            <button 
              type="button" 
              className="admin-btn-add-item-mint"
              onClick={handleAddItem}
            >
              <Plus size={16} />
              <span>Add item</span>
            </button>

            <div className="admin-quote-total-display">
              <span style={{ fontSize: '0.92rem', color: '#39574f' }}>Total (INR)</span>
              <span>{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="admin-quote-notice-banner">
        <AlertCircle size={20} color="#ea580c" style={{ flexShrink: 0 }} />
        <span>This is a demo quote for reference only.</span>
      </div>

      {/* SECTION: ADDITIONAL COST REQUESTS */}
      <div className="admin-section-block">
        <h3 className="admin-instructions-title" style={{ fontSize: '1rem', marginBottom: '4px' }}>
          Additional cost requests
        </h3>

        <div className="admin-additional-cost-card">
          <div className="admin-cost-icon-box">
            <Package size={24} />
          </div>

          <div className="admin-cost-info">
            <div className="admin-cost-header">
              <span className="admin-cost-amount">INR 300</span>
              <span className={`admin-badge ${costStatus === 'Approved' ? 'assigned' : costStatus === 'Rejected' ? 'badge-not-checked' : 'unassigned'}`}>
                {costStatus}
              </span>
            </div>

            <div className="admin-cost-meta">
              Requested on 4 Oct 2026, 2:15 PM
            </div>
            <div className="admin-cost-reason">
              Reason: Extra packing materials (5 boxes)
            </div>

            <div className="admin-cost-actions">
              <button 
                type="button" 
                className="admin-btn-secondary"
                style={{ flex: 'none', padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => alert('Extra 5 carton boxes requested by coordinator during packing.')}
              >
                View details
              </button>

              {costStatus === 'Pending approval' && (
                <>
                  <button 
                    type="button" 
                    className="admin-btn-dark-green"
                    style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                    onClick={handleApproveCost}
                  >
                    Approve
                  </button>
                  <button 
                    type="button" 
                    className="admin-btn-reject"
                    style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                    onClick={handleRejectCost}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: SEND TO CUSTOMER */}
      <div className="admin-send-customer-block">
        <div className="admin-send-customer-meta">
          <strong>Send to customer</strong>
          <span>Share quote with customer for acceptance.</span>
        </div>

        <button 
          type="button" 
          className="admin-btn-dark-green"
          onClick={handleSendToCustomer}
        >
          <Send size={16} />
          <span>Send to customer</span>
        </button>
      </div>

    </div>
  );
}
