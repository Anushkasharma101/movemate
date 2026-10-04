import React from 'react';
import { 
  Calendar, Clock, MapPin, Phone, ArrowRight, CheckCircle2, 
  ChevronDown, Search, Bell, Package, Check 
} from 'lucide-react';

export default function CoordinatorOverview({ 
  onNavigateJobBrief, 
  onNavigateExecution,
  onNavigateIssue,
  coordinator = { name: 'Rohit Sharma', role: 'Coordinator', initials: 'RS' }
}) {
  return (
    <div className="coord-overview-container animate-fade-in">
      
      {/* Top Header Greeting & Date Selector */}
      <div className="coord-page-header">
        <div>
          <h1 className="coord-page-title">Good morning, {coordinator.name.split(' ')[0]}</h1>
          <p className="coord-page-subtitle">Here's your schedule for Sunday, 4 October 2026</p>
        </div>

        <div className="coord-date-picker-btn">
          <Calendar size={16} className="text-primary" />
          <span className="coord-date-text">Sun, 4 Oct 2026</span>
          <ChevronDown size={14} className="coord-arrow" />
        </div>
      </div>

      {/* Top Row: Assigned Job & Today's Schedule */}
      <div className="coord-top-cards-grid">
        
        {/* Left Card: Assigned Job */}
        <div className="coord-card assigned-job-card">
          <div className="assigned-job-header">
            <span className="badge-assigned-job">Assigned Job</span>
            <span className="badge-job-id">MM-1042</span>
          </div>

          <div className="assigned-customer-row">
            <img 
              src="/images/pooja_avatar.jpg" 
              alt="Pooja" 
              className="assigned-customer-avatar"
            />
            <div className="assigned-customer-info">
              <strong className="assigned-cust-name">Pooja</strong>
              <span className="assigned-cust-type">1 BHK Move • Residential</span>
              <a href="tel:+919876543210" className="assigned-cust-phone">
                <Phone size={13} /> +91 98765 43210
              </a>
              <div className="assigned-routes-list">
                <div className="route-node">
                  <MapPin size={13} className="text-primary" />
                  <span>From: Kothrud, Pune</span>
                </div>
                <div className="route-node">
                  <MapPin size={13} className="text-primary" />
                  <span>To: Wakad, Pune</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="btn-start-job"
            onClick={onNavigateJobBrief}
          >
            <span>Start job</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Card: Today's Schedule */}
        <div className="coord-card today-schedule-card">
          <h2 className="coord-card-title">Today's schedule</h2>

          <div className="coord-schedule-timeline">
            
            <div className="sched-item">
              <span className="sched-time">08:00</span>
              <div className="sched-content">
                <span className="sched-task">Team arrival & packing</span>
              </div>
            </div>

            <div className="sched-item highlight-quiet">
              <span className="sched-time">11:00</span>
              <div className="sched-content">
                <span className="sched-task">Customer meeting</span>
                <div className="quiet-hours-callout">
                  <strong>Quiet hours (11:00 – 13:00)</strong>
                  <span>No heavy work / keep it quiet</span>
                </div>
              </div>
            </div>

            <div className="sched-item">
              <span className="sched-time">13:00</span>
              <div className="sched-content">
                <span className="sched-task">Resume packing & loading</span>
              </div>
            </div>

            <div className="sched-item">
              <span className="sched-time">15:00</span>
              <div className="sched-content">
                <span className="sched-task">Transit to new home</span>
              </div>
            </div>

            <div className="sched-item">
              <span className="sched-time">17:00</span>
              <div className="sched-content">
                <span className="sched-task">Unloading & setup</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Card: Upcoming Jobs */}
      <div className="coord-card upcoming-jobs-card">
        <div className="upcoming-jobs-header">
          <h2 className="coord-card-title">Upcoming jobs</h2>
          <button type="button" className="btn-view-calendar-link">
            View calendar →
          </button>
        </div>

        <div className="coord-table-wrapper">
          <table className="coord-jobs-table">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Move type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="coord-row-clickable" onClick={onNavigateJobBrief}>
                <td className="font-bold text-primary">MM-1042</td>
                <td>4 Oct 2026</td>
                <td>Pooja</td>
                <td>1 BHK</td>
                <td>
                  <span className="badge-status-inprogress">In progress</span>
                </td>
              </tr>
              <tr>
                <td className="font-bold">MM-1043</td>
                <td>5 Oct 2026</td>
                <td>Karan Mehta</td>
                <td>2 BHK</td>
                <td>
                  <span className="badge-status-assigned">Assigned</span>
                </td>
              </tr>
              <tr>
                <td className="font-bold">MM-1044</td>
                <td>6 Oct 2026</td>
                <td>Neha Kulkarni</td>
                <td>1 BHK</td>
                <td>
                  <span className="badge-status-scheduled">Scheduled</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
