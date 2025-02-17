import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchAttendanceHistory } from '../api';
import './NurseDashboard.css';
import moment from 'moment';
import axios from 'axios';
import { useCallback } from 'react';

const NurseCalendar = () => {
  const [events, setEvents] = useState([]);
  const [shiftDates, setShiftDates] = useState([]);
  useEffect(() => {
    console.log('Events2234:', events);
  }, [events]);

  const getAttendanceStatus = (attendanceHistory, shiftDate) => {
    const attendanceRecord = attendanceHistory.attendanceHistory.find((record) =>
      moment(record.date).isSame(shiftDate, 'day'));
    console.log('Attendance record found:', attendanceRecord);
    if (attendanceRecord) {
      console.log('stat', attendanceRecord.status);

      return attendanceRecord.status === 'Present' ? 'Shift Covered' : 'Shift Not Covered';

    } else {
      console.log('ELSE');
      return 'Shift Should be Covered';
    }

  };

  

  const updateShiftStatus = async (shiftId, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/shifts/${shiftId}`, {
        status,
      });
      console.log('Shift status updated:', response.data);
    } catch (error) {
      console.error('Error updating shift status:', error);
    }
  };
  const loadShifts = async () => {
    try {
      const nurseId = localStorage.getItem('nurseId');
      const response = await axios.get(`http://localhost:5000/api/shifts/nurse/${nurseId}`);
      const attendanceHistory = await fetchAttendanceHistory(nurseId);
      console.log('Attendance history response:', attendanceHistory);
      if (Array.isArray(response.data)) {
        const shifts = response.data;

        const formattedEvents = shifts.map((shift) => {
          const startDate = moment(shift.date, 'YYYY-MM-DD');
          const startTime = moment(shift.startTime, 'HH:mm');
          const endTime = moment(shift.endTime, 'HH:mm');
          //a
          const startDateTime = moment.utc(`${startDate.format('YYYY-MM-DD')}T${shift.startTime}`).toDate();
          const endDateTime = moment.utc(`${startDate.format('YYYY-MM-DD')}T${shift.endTime}`).toDate();
          const attendanceStatus =
            // console.log("absdfiu",getAttendanceStatus(attendanceHistory, shift.date));
            getAttendanceStatus(attendanceHistory, shift.date);
          let title;
          if (attendanceStatus === 'Shift Covered') {
            console.log("hihi",shift._id)
            updateShiftStatus(shift._id,'Covered');
            title = 'Shift Covered';
          } else if (attendanceStatus === 'Shift Should be Covered') {
            const startTime = moment(shift.startTime, 'HH:mm');
            const endTime = moment(shift.endTime, 'HH:mm');
            title = `To be covered\nShift: ${startTime.format('hh:mm A')} - ${endTime.format('hh:mm A')}`;
          } else {
            title = `Shift missed`;
          }
          return {
            title: title ,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
          };
        });

        // const shiftDates = shifts.map((shift) => {
        //   const date = moment(shift.date, 'MM/DD/YYYY');
        //   return date.format('YYYY-MM-DD');
        // });

        setEvents(formattedEvents);
        // console.log('eventssdsdsd', events);
        setShiftDates(shiftDates);
      } else {
        console.log('Response data is not an array');
        const shifts = response.data.shifts; // Convert the object to an array
        const formattedEvents = shifts.map((shift) => {
          const startDate = moment(shift.date, 'MM/DD/YYYY');
          const startTime = moment(shift.startTime, 'HH:mm');
          const endTime = moment(shift.endTime, 'HH:mm');

          const startDateTime = moment(startDate).add(startTime.hours(), 'hours').add(startTime.minutes(), 'minutes');
          const endDateTime = moment(startDate).add(endTime.hours(), 'hours').add(endTime.minutes(), 'minutes');

          return {
            title: `Shift: ${shift.startTime} - ${shift.endTime}`,
            start: startDateTime.toISOString(), // Convert to ISO string
            end: endDateTime.toISOString(), // Convert to ISO string
          };
        });
        const shiftDates = shifts.map((shift) => {
          const date = moment(shift.date, 'MM/DD/YYYY');
          return date.format('YYYY-MM-DD');
        });
        setEvents(formattedEvents);
        console.log('Events2:', events);
        setShiftDates(shiftDates);
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);
  const logEvent = useCallback((eventInfo) => {
    console.log('Event rendered:', eventInfo.event);
  }, []);
  const dayCellClassNames = (arg) => {
    const dateStr = arg.date.toISOString().split('T')[0]; // Use UTC date
    return shiftDates.includes(dateStr) ? 'shift-day' : '';
  };
  console.log('Events before rendering:', events);
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"

        events={events}
        timeZone="UTC"
        eventContent={(eventInfo) => {
          if (eventInfo.event.extendedProps.className === 'shift-covered') {
            return (
              <div style={{ backgroundColor: 'green' }}>
                {eventInfo.event.title}
              </div>
            );
          } else if (eventInfo.event.extendedProps.className === 'shift-not-covered') {
            return (
              <div style={{ backgroundColor: 'red' }}>
                {eventInfo.event.title}
              </div>
            );
          } else {
            return (
              <div>
                {eventInfo.event.title}
                {logEvent(eventInfo)}
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default NurseCalendar;