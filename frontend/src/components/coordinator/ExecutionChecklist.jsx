import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, UploadCloud, Camera, Clock, 
  MoreHorizontal, MessageSquare, Edit3, X, Image as ImageIcon,
  CheckCircle2, Plus, AlertCircle, Calendar
} from 'lucide-react';

export default function ExecutionChecklist({ 
  onBack, 
  onNavigateIssue,
  onNavigateBrief 
}) {
  const [activeStage, setActiveStage] = useState(1); // 1: Packing, 2: Loading, 3: Transit, 4: Unloading
  
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Pack kitchen items', done: true, time: '10:15', photo: '/images/packing_boxes.jpg' },
    { id: 2, name: 'Pack bedroom items', done: true, time: '10:45', photo: '/images/packing_furniture.jpg' },
    { id: 3, name: 'Pack living room items', done: true, time: '10:55', photo: '/images/packing_sofa.jpg' },
    { id: 4, name: 'Pack fragile items (e.g., monitor)', done: false, time: '--:--', photo: null },
    { id: 5, name: 'Final packing check', done: false, time: '--:--', photo: null },
    { id: 6, name: 'Mark boxes with room labels', done: false, time: '--:--', photo: null }
  ]);

  const [evidencePhotos, setEvidencePhotos] = useState([
    { id: 1, src: '/images/packing_boxes.jpg', label: 'Cartons' },
    { id: 2, src: '/images/packing_furniture.jpg', label: 'Wardrobe wrap' },
    { id: 3, src: '/images/packing_sofa.jpg', label: 'Sofa corner pads' }
  ]);

  const [timestamp, setTimestamp] = useState('04/10/2026 10:55');
  const [customerMessage, setCustomerMessage] = useState(
    'Hi Pooja,\nWe have completed packing your kitchen, bedroom and living room items. Continuing with fragile items now.\n\n— MoveMate Team'
  );
  const [isEditingMsg, setIsEditingMsg] = useState(false);

  const completedCount = tasks.filter(t => t.done).length;

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextDone = !t.done;
        return {
          ...t,
          done: nextDone,
          time: nextDone ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
          photo: nextDone && !t.photo ? '/images/bubble_wrap.jpg' : t.photo
        };
      }
      return t;
    }));
  };

  const handleUpdateStatus = () => {
    alert(`Status update sent to Pooja! Stage: Packing (${completedCount}/6 completed). Customer SMS & Portal updated.`);
    if (activeStage < 4) {
      setActiveStage(activeStage + 1);
    }
  };

  const handleAddPhoto = () => {
    setEvidencePhotos(prev => [
      ...prev,
      { id: Date.now(), src: '/images/bubble_wrap.jpg', label: 'Fragile wrap' }
    ]);
  };

  const removePhoto = (id) => {
    setEvidencePhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="coord-execution-container animate-fade-in">
      
      {/* Breadcrumb Navigation */}
      <div className="coord-breadcrumbs-row">
        <button type="button" className="btn-back-breadcrumb" onClick={onNavigateBrief}>
          <ArrowLeft size={16} /> MM-1042
        </button>
        <span className="breadcrumb-sep">&gt;</span>
        <span className="breadcrumb-current">Execution</span>
      </div>

      {/* Screen Title & Badges */}
      <div className="execution-header-row">
        <div>
          <h1 className="execution-main-title">Execution checklist – MM-1042</h1>
          <div className="execution-meta-pills">
            <span className="customer-tag-pill">Pooja</span>
            <span className="meta-text-sep">|</span>
            <span>1 BHK Move</span>
            <span className="meta-text-sep">|</span>
            <span>4 October 2026</span>
          </div>
        </div>

        <span className="badge-in-progress-live">
          <span className="live-dot-pulse"></span> In progress
        </span>
      </div>

      {/* 4-Stage Stepper Navigation Bar */}
      <div className="execution-stepper-bar">
        <button 
          type="button" 
          className={`exec-step-node ${activeStage === 1 ? 'active' : (activeStage > 1 ? 'completed' : '')}`}
          onClick={() => setActiveStage(1)}
        >
          <span className="step-circle">{activeStage > 1 ? <Check size={14} /> : '1'}</span>
          <span className="step-text">Packing</span>
        </button>

        <button 
          type="button" 
          className={`exec-step-node ${activeStage === 2 ? 'active' : (activeStage > 2 ? 'completed' : '')}`}
          onClick={() => setActiveStage(2)}
        >
          <span className="step-circle">{activeStage > 2 ? <Check size={14} /> : '2'}</span>
          <span className="step-text">Loading</span>
        </button>

        <button 
          type="button" 
          className={`exec-step-node ${activeStage === 3 ? 'active' : (activeStage > 3 ? 'completed' : '')}`}
          onClick={() => setActiveStage(3)}
        >
          <span className="step-circle">{activeStage > 3 ? <Check size={14} /> : '3'}</span>
          <span className="step-text">Transit</span>
        </button>

        <button 
          type="button" 
          className={`exec-step-node ${activeStage === 4 ? 'active' : ''}`}
          onClick={() => setActiveStage(4)}
        >
          <span className="step-circle">4</span>
          <span className="step-text">Unloading</span>
        </button>
      </div>

      {/* Two Column Grid: Checklist Tasks & Evidence Upload/Preview */}
      <div className="execution-grid-2col">
        
        {/* Left Column: Packing Tasks */}
        <div className="execution-card tasks-card">
          <div className="tasks-card-header">
            <h2 className="tasks-section-title">Packing tasks ({completedCount}/{tasks.length})</h2>
          </div>

          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className="task-row-item">
                <label className="task-left-label">
                  <input 
                    type="checkbox" 
                    checked={task.done} 
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="task-custom-chk">
                    {task.done && <Check size={13} className="text-white" />}
                  </span>
                  <span className={`task-name-text ${task.done ? 'done' : ''}`}>
                    {task.name}
                  </span>
                </label>

                <div className="task-right-actions">
                  {task.photo ? (
                    <div className="task-photo-thumb">
                      <img src={task.photo} alt={task.name} />
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-add-task-photo"
                      onClick={() => toggleTask(task.id)}
                    >
                      <Camera size={12} /> Add photo
                    </button>
                  )}

                  <span className="task-timestamp">{task.time}</span>

                  <button 
                    type="button" 
                    className="btn-task-menu"
                    onClick={() => alert(`Task options for "${task.name}"`)}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            className="btn-update-status-coral"
            onClick={handleUpdateStatus}
          >
            <span>Update status</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Column: Upload Evidence & Preview Customer Update */}
        <div className="execution-right-col">
          
          {/* Card 1: Upload Evidence */}
          <div className="execution-card upload-evidence-card">
            <h3 className="right-card-title">Upload evidence</h3>

            <div className="drag-drop-upload-zone" onClick={handleAddPhoto}>
              <UploadCloud size={28} className="text-primary" />
              <p>Drag & drop photos or <strong>click to upload</strong></p>
            </div>

            {/* Evidence Thumbnails Row */}
            <div className="evidence-thumbs-row">
              {evidencePhotos.map((photo) => (
                <div key={photo.id} className="evidence-thumb-wrapper">
                  <img src={photo.src} alt={photo.label} className="evidence-img" />
                  <button 
                    type="button" 
                    className="btn-remove-evidence"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    title="Remove"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <button 
                type="button" 
                className="btn-add-more-photos"
                onClick={handleAddPhoto}
              >
                <Plus size={16} />
                <span>Add photos</span>
              </button>
            </div>

            {/* Timestamp input */}
            <div className="timestamp-group">
              <label className="timestamp-label">Timestamp</label>
              <div className="timestamp-input-wrap">
                <input 
                  type="text" 
                  className="timestamp-input"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                />
                <Calendar size={15} className="timestamp-icon" />
              </div>
            </div>
          </div>

          {/* Card 2: Preview Customer Update */}
          <div className="execution-card preview-update-card">
            <div className="preview-update-header">
              <div className="preview-title-left">
                <MessageSquare size={16} className="text-primary" />
                <h3 className="right-card-title">Preview customer update</h3>
              </div>
              <button 
                type="button" 
                className="btn-edit-preview-msg"
                onClick={() => setIsEditingMsg(!isEditingMsg)}
                title="Edit message"
              >
                <Edit3 size={14} />
              </button>
            </div>

            {isEditingMsg ? (
              <textarea 
                className="preview-msg-textarea"
                rows={4}
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
              />
            ) : (
              <div className="preview-msg-bubble">
                <p>{customerMessage}</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Floating Issue Trigger Bar */}
      <div className="execution-bottom-bar">
        <div className="issue-prompt-text">
          <AlertCircle size={16} className="text-orange" />
          <span>Need extra materials or discovered an unexpected item?</span>
        </div>
        <button 
          type="button" 
          className="btn-report-issue-action"
          onClick={onNavigateIssue}
        >
          Report Issue & Request Approval →
        </button>
      </div>

    </div>
  );
}
