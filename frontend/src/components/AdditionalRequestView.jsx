import React, { useState } from 'react';
import { 
  ArrowLeft, AlertTriangle, Check, X, Send, Paperclip, 
  Image as ImageIcon, ZoomIn, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export default function AdditionalRequestView({ 
  onBack, 
  onApproveSuccess,
  user = { name: 'Pooja' } 
}) {
  const [status, setStatus] = useState('pending'); // 'pending' | 'approved' | 'declined'
  const [photoLightbox, setPhotoLightbox] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Aarav',
      avatar: '/images/aarav_avatar.jpg',
      isDriver: true,
      time: '10:15 AM',
      text: 'Hi Pooja, we need a few additional packing materials for fragile items. Sharing a photo for your reference.',
      hasImage: true,
      imageSrc: '/images/bubble_wrap.jpg',
      imageCaption: 'Extra bubble wrap roll for glassware'
    },
    {
      id: 2,
      sender: user?.name || 'Pooja',
      isDriver: false,
      time: '10:22 AM',
      text: 'Thanks for sharing. I will review and get back.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleApprove = () => {
    setStatus('approved');
    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'Pooja',
      isDriver: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'I have approved the additional ₹300 for the extra packing materials. Please proceed!'
    };
    setChatMessages(prev => [...prev, newMsg]);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Aarav',
          avatar: '/images/aarav_avatar.jpg',
          isDriver: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Thank you Pooja! We are wrapping the kitchen fragile items now.'
        }
      ]);
    }, 900);

    if (onApproveSuccess) {
      onApproveSuccess(300);
    }
  };

  const handleDecline = () => {
    if (window.confirm('Are you sure you want to decline this additional cost request? The team will use standard packing materials.')) {
      setStatus('declined');
      const newMsg = {
        id: Date.now(),
        sender: user?.name || 'Pooja',
        isDriver: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: 'I have declined this additional request. Please proceed with standard packaging.'
      };
      setChatMessages(prev => [...prev, newMsg]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name || 'Pooja',
      isDriver: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput.trim()
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Aarav',
          avatar: '/images/aarav_avatar.jpg',
          isDriver: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Understood. Let me know if you need anything else!'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="additional-req-container animate-fade-in">
      {/* Top Breadcrumb */}
      <button 
        type="button" 
        className="btn-back-breadcrumb" 
        onClick={onBack}
      >
        <ArrowLeft size={16} /> Back to move details
      </button>

      {/* Screen Title */}
      <div className="add-req-header">
        <h1 className="add-req-title">Additional request from Aarav</h1>
        <p className="add-req-meta">MM-1042 • 4 October 2026</p>
      </div>

      {/* Two Column Content Grid */}
      <div className="add-req-grid">
        {/* Left Column: Request Details Card */}
        <div className="req-details-card">
          <div className="req-details-header">
            <h2 className="req-card-title">Request details</h2>
            {status === 'pending' && (
              <span className="badge-pending-approval">Pending your approval</span>
            )}
            {status === 'approved' && (
              <span className="badge-approved-status">
                <Check size={14} /> Approved
              </span>
            )}
            {status === 'declined' && (
              <span className="badge-declined-status">
                <X size={14} /> Declined
              </span>
            )}
          </div>

          <div className="req-info-rows">
            <div className="req-row">
              <span className="req-row-label">Additional amount</span>
              <span className="req-row-value req-amount-highlight">₹ 300</span>
            </div>

            <div className="req-row">
              <span className="req-row-label">Reason</span>
              <span className="req-row-value req-reason-text">
                Need extra packing material for fragile items (glassware and kitchen items).
              </span>
            </div>

            <div className="req-row req-evidence-row">
              <span className="req-row-label">Evidence photo</span>
              <div className="req-evidence-preview" onClick={() => setPhotoLightbox(true)}>
                <img 
                  src="/images/bubble_wrap.jpg" 
                  alt="Evidence: Bubble wrap roll" 
                  className="req-evidence-img"
                />
                <div className="req-photo-hover-hint">
                  <ZoomIn size={16} />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>

            <div className="req-divider"></div>

            <div className="req-row">
              <span className="req-row-label">Amount before</span>
              <span className="req-row-value">₹ 4,500</span>
            </div>

            <div className="req-row">
              <span className="req-row-label">Amount after (if approved)</span>
              <span className="req-row-value req-amount-after">
                {status === 'approved' ? '₹ 4,800 (Updated Total)' : '₹ 4,800'}
              </span>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="req-warning-banner">
            <div className="req-warning-icon-wrap">
              <span className="req-warning-i">!</span>
            </div>
            <div className="req-warning-text">
              <strong>No charges will be added automatically.</strong>
              <p>Please review and approve to proceed.</p>
            </div>
          </div>

          {/* Action Buttons */}
          {status === 'pending' ? (
            <div className="req-actions-row">
              <button 
                type="button" 
                className="btn-req-decline"
                onClick={handleDecline}
              >
                Decline
              </button>
              <button 
                type="button" 
                className="btn-req-approve"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
          ) : (
            <div className={`req-resolved-notice ${status}`}>
              {status === 'approved' ? (
                <>
                  <CheckCircle2 size={18} className="text-primary" />
                  <span>You have approved this request for ₹300. Move total is now ₹4,800.</span>
                </>
              ) : (
                <>
                  <X size={18} className="text-danger" />
                  <span>You declined this request. Standard packaging will be utilized.</span>
                </>
              )}
              <button 
                type="button" 
                className="btn-undo-status"
                onClick={() => setStatus('pending')}
              >
                Change decision
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Messages with Aarav Card */}
        <div className="messages-with-aarav-card">
          <div className="messages-card-header">
            <h2 className="req-card-title">Messages with Aarav</h2>
          </div>

          <div className="aarav-chat-thread">
            {chatMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`aarav-msg-item ${msg.isDriver ? 'driver-side' : 'customer-side'}`}
              >
                {msg.isDriver && (
                  <img 
                    src={msg.avatar || '/images/aarav_avatar.jpg'} 
                    alt={msg.sender} 
                    className="aarav-msg-avatar"
                  />
                )}
                
                <div className="aarav-msg-content">
                  <div className="aarav-msg-meta">
                    <strong className="aarav-msg-sender">{msg.sender}</strong>
                    <span className="aarav-msg-time">{msg.time}</span>
                  </div>

                  <div className={`aarav-msg-bubble ${msg.isDriver ? 'driver-bubble' : 'customer-bubble'}`}>
                    <p>{msg.text}</p>
                    {msg.hasImage && (
                      <div 
                        className="aarav-msg-attachment"
                        onClick={() => setPhotoLightbox(true)}
                        title="Click to view photo"
                      >
                        <img 
                          src={msg.imageSrc} 
                          alt={msg.imageCaption || 'Attachment'} 
                          className="msg-attachment-thumb"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form className="aarav-chat-input-row" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              className="aarav-chat-input"
              placeholder="Type a message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button 
              type="button" 
              className="btn-chat-attach"
              title="Attach photo/document"
              onClick={() => alert('Attachment option: Select an image to send to Aarav.')}
            >
              <Paperclip size={18} />
            </button>
            <button 
              type="submit" 
              className="btn-chat-submit"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Lightbox for Evidence Photo */}
      {photoLightbox && (
        <div className="modal-overlay" onClick={() => setPhotoLightbox(false)}>
          <div className="modal-container photo-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Evidence Photo: Packaging Material</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setPhotoLightbox(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="photo-lightbox-body">
              <img 
                src="/images/bubble_wrap.jpg" 
                alt="Evidence bubble wrap" 
                className="lightbox-img" 
              />
              <p className="lightbox-caption">
                Bubble wrap roll required for extra fragile glassware & kitchenware safety.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
