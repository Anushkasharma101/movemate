import React, { useState } from 'react';
import { 
  Check, CheckCircle2, Star, X, AlertCircle, ArrowRight,
  Bed, Refrigerator, Tv, Package, ShieldCheck, ThumbsUp, 
  Sparkles, Camera, UploadCloud, ChevronDown
} from 'lucide-react';

export default function DeliveryChecklistView({ 
  onBack,
  onDeliveryConfirmed,
  user = { name: 'Pooja' }
}) {
  const [items, setItems] = useState([
    { id: 'bed', name: 'Bed', icon: 'bed', received: true, condition: 'Good' },
    { id: 'fridge', name: 'Fridge', icon: 'fridge', received: true, condition: 'Good' },
    { id: 'monitor', name: 'Monitor', icon: 'monitor', received: true, condition: 'Good' },
    { id: 'boxes', name: 'Moving boxes (10)', icon: 'boxes', received: true, condition: 'Good' },
  ]);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDamageModal, setShowDamageModal] = useState(false);
  const [rating, setRating] = useState(4); // 4 filled stars by default as in screenshot
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('Great experience! The team was professional and careful with all items.');
  const [isDeliveryCompleted, setIsDeliveryCompleted] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Toggle item received checkbox
  const handleToggleReceived = (id) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, received: !item.received } : item
    ));
  };

  // Change item condition
  const handleConditionChange = (id, newCondition) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, condition: newCondition } : item
    ));
  };

  const handleConfirmDelivery = () => {
    setIsDeliveryCompleted(true);
    setShowRatingModal(true);
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    setRatingSubmitted(true);
    setTimeout(() => {
      setShowRatingModal(false);
      if (onDeliveryConfirmed) onDeliveryConfirmed({ rating, review: reviewText });
    }, 1200);
  };

  const renderItemIcon = (icon) => {
    switch(icon) {
      case 'bed':
        return (
          <div className="item-icon-box item-bed">
            <span role="img" aria-label="bed">🛏️</span>
          </div>
        );
      case 'fridge':
        return (
          <div className="item-icon-box item-fridge">
            <span role="img" aria-label="fridge">🧊</span>
          </div>
        );
      case 'monitor':
        return (
          <div className="item-icon-box item-monitor">
            <span role="img" aria-label="monitor">🖥️</span>
          </div>
        );
      case 'boxes':
      default:
        return (
          <div className="item-icon-box item-boxes">
            <span role="img" aria-label="boxes">📦</span>
          </div>
        );
    }
  };

  return (
    <div className="delivery-checklist-container animate-fade-in">
      
      {/* Top Header Row */}
      <div className="delivery-header-row">
        <div>
          <h1 className="delivery-title">Delivery checklist</h1>
          <p className="delivery-meta">MM-1042 • Pune • 4 October 2026</p>
        </div>

        {/* Top Right Delivered Status Badge */}
        <div className="move-delivered-badge">
          <div className="badge-check-icon">
            <Check size={18} />
          </div>
          <div className="badge-text-col">
            <strong className="badge-main-text">Move delivered</strong>
            <span className="badge-sub-text">4 Oct 2026, 2:45 PM</span>
          </div>
        </div>
      </div>

      {/* Main Checklist Card */}
      <div className="checklist-main-card">
        <div className="checklist-card-header">
          <h2 className="checklist-section-title">Check received items</h2>
          <p className="checklist-section-desc">
            Please confirm that you have received all items and they are in good condition.
          </p>
        </div>

        {/* Table of Items */}
        <div className="checklist-table-wrapper">
          <table className="delivery-table">
            <thead>
              <tr>
                <th className="th-item">Item</th>
                <th className="th-received">Received</th>
                <th className="th-condition">Condition</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="delivery-row">
                  <td className="td-item-info">
                    <div className="item-cell-content">
                      {renderItemIcon(item.icon)}
                      <span className="item-name-label">{item.name}</span>
                    </div>
                  </td>
                  
                  <td className="td-received-checkbox">
                    <button 
                      type="button"
                      className={`custom-checkbox-btn ${item.received ? 'checked' : ''}`}
                      onClick={() => handleToggleReceived(item.id)}
                      aria-label={`Mark ${item.name} as received`}
                    >
                      {item.received && <Check size={14} className="checkbox-tick" />}
                    </button>
                  </td>

                  <td className="td-condition-select">
                    <div className="condition-select-wrap">
                      <select 
                        value={item.condition}
                        onChange={(e) => handleConditionChange(item.id, e.target.value)}
                        className={`condition-dropdown ${item.condition !== 'Good' ? 'has-issue' : ''}`}
                      >
                        <option value="Good">Good</option>
                        <option value="Minor Scratch">Minor Scratch</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Missing">Missing</option>
                      </select>
                      <ChevronDown size={14} className="dropdown-arrow-icon" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Actions Row */}
        <div className="checklist-footer-row">
          <button 
            type="button" 
            className="btn-report-damage-link"
            onClick={() => setShowDamageModal(true)}
          >
            Report damage or missing item →
          </button>

          <button 
            type="button" 
            className="btn-confirm-delivery-pill"
            onClick={handleConfirmDelivery}
          >
            Confirm delivery
          </button>
        </div>
      </div>

      {/* RATING MODAL (As shown in Screenshot 2) */}
      {showRatingModal && (
        <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
          <div 
            className="modal-container rating-modal-container animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rating-modal-header">
              <h2 className="rating-modal-title">Rate your move</h2>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowRatingModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {ratingSubmitted ? (
              <div className="rating-success-body animate-fade-in">
                <div className="success-icon-wrap">
                  <Sparkles size={32} className="text-primary" />
                </div>
                <h3>Thank you for your feedback!</h3>
                <p>Your rating helps Aarav and the MoveMate crew maintain 5-star service excellence.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="rating-modal-body">
                <p className="rating-question">How was your overall experience with MoveMate?</p>

                {/* 5-Star Interactive Rating */}
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        className={`star-btn ${isFilled ? 'filled' : 'empty'}`}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                        aria-label={`${starVal} star`}
                      >
                        <Star 
                          size={32} 
                          fill={isFilled ? "#F59E0B" : "none"} 
                          stroke={isFilled ? "#F59E0B" : "#D1D5DB"} 
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Textarea */}
                <div className="feedback-textarea-wrap">
                  <textarea 
                    className="feedback-textarea"
                    rows={4}
                    maxLength={500}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your experience with MoveMate..."
                  />
                  <div className="char-counter">{reviewText.length}/500</div>
                </div>

                {/* Submit Rating Button */}
                <button type="submit" className="btn-submit-rating">
                  Submit rating
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REPORT DAMAGE MODAL */}
      {showDamageModal && (
        <div className="modal-overlay" onClick={() => setShowDamageModal(false)}>
          <div 
            className="modal-container damage-modal-container animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-badge alert-badge">
                  <ShieldCheck size={14} />
                  <span>MoveMate Transit Insurance</span>
                </div>
                <h2>Report Damage or Missing Item</h2>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowDamageModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="damage-modal-body">
              <p className="damage-subtext">
                All MoveMate moves are covered by ₹0-deductible transit assurance. Report any issues within 48 hours for immediate compensation.
              </p>

              <div className="form-group">
                <label className="form-sublabel">Select Affected Item</label>
                <select className="form-input">
                  <option value="bed">Bed</option>
                  <option value="fridge">Fridge</option>
                  <option value="monitor">Monitor</option>
                  <option value="boxes">Moving boxes</option>
                  <option value="other">Other item</option>
                </select>
              </div>

              <div className="form-group mt-3">
                <label className="form-sublabel">Issue Description</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  placeholder="Describe the scratch, dent, or missing box..."
                ></textarea>
              </div>

              <div className="form-group mt-3">
                <label className="form-sublabel">Upload Photo of Damage</label>
                <div className="file-upload-placeholder">
                  <Camera size={20} className="text-muted" />
                  <span>Click to browse photo or take picture</span>
                </div>
              </div>

              <div className="damage-modal-actions mt-4">
                <button 
                  type="button" 
                  className="btn-cancel-modal"
                  onClick={() => setShowDamageModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-submit-ticket-solid"
                  onClick={() => {
                    alert('Damage report submitted to claims department. Ticket #CLAIM-892 created.');
                    setShowDamageModal(false);
                  }}
                >
                  Submit Damage Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
