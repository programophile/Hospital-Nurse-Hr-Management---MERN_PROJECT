import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchShifts } from '../api';
import './NurseDashboard.css';

const NurseCalendar = () => {
  const [events, setEvents] = useState([]);
  const [shiftDates, setShiftDates] = useState([]);

  const loadShifts = async () => {
    try {
      const response = await fetchShifts();
      const shifts = response.data;

      // Log the raw shift data
      console.log('Raw Shifts:', shifts);

      // Format shifts for FullCalendar
      const formattedEvents = shifts.map((shift) => {
        const startDateTime = new Date(shift.date + 'T' + shift.startTime + 'Z').toISOString();
        const endDateTime = new Date(shift.date + 'T' + shift.endTime + 'Z').toISOString();

        return {
          title: `Shift: ${shift.startTime} - ${shift.endTime}`,
          start: startDateTime,
          end: endDateTime,
        };
      });

      // Extract unique dates for highlighting (in UTC)
      const uniqueDates = [...new Set(shifts.map(shift => new Date(shift.date + 'T00:00:00Z').toISOString().split('T')[0]))];
      console.log('Unique Shift Dates (UTC):', uniqueDates); // Log the unique dates
      setShiftDates(uniqueDates);

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  const dayCellClassNames = (arg) => {
    const dateStr = arg.date.toISOString().split('T')[0]; // Use UTC date
    return shiftDates.includes(dateStr) ? 'shift-day' : '';
  };

return (
  <div className="calendar-container">
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      initialDate="2024-01-01"
      events={events}
      timeZone="UTC"
      dayCellClassNames={dayCellClassNames}
      eventContent={(eventInfo) => (
        <div>
          {eventInfo.event.title} {/* Only display the title */}
        </div>
      )}
    />
  </div>
);
};
export default NurseCalendar;