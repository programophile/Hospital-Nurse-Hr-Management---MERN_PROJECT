// NurseDashboard.js
import React from 'react';
import NurseCalendar from './NurseCalendar'; // Import the NurseCalendar component
import './NurseDashboard.css';
import NurseProfile from './NurseProfile';

const NurseDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="other-content">

        <NurseProfile />
        {/* Add other content here (e.g., profile, notifications, etc.) */}
      </div>
      <NurseCalendar /> {/* Use the NurseCalendar component here */}
    </div>
  );
};

export default NurseDashboard;