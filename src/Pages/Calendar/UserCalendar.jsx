import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pl';
import { apiService } from '../../_services';
import { EditUser } from '../../Dialogs/User';

const useStyles = makeStyles(theme => ({
  mainCalendar: {
    width: '100%',
    marginRight: '45px',
  },
}));

function UserCalendarComp(props) {
  const classes = useStyles();
  const tableRef = useRef();
  const localizer = momentLocalizer(moment);
  const [calendarState, setCalendarState] = useState({
    view: Views.WEEK,
  });
  const [activeWorkScheduleDayList, setActiveWorkScheduleDay] = useState([]);
  const [myEventsList, setMyEventsList] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(
    () => {
      apiService.get('user_timesheet_days?_order[name]=asc&userTimesheet.owner.username=admin')
        .then((result) => {
          const userTimesheetDayList = [];
          result['hydra:member'].forEach((userTimesheetDay) => {
            if (userTimesheetDay.dayStartTime === null) {
              userTimesheetDayList[userTimesheetDay.id] = {
                id: userTimesheetDay.id,
                allDay: true,
                title: userTimesheetDay.presenceType.name,
                start: moment(`${userTimesheetDay.userWorkScheduleDay.dayDefinition.id}`).toDate(),
                end: moment(`${userTimesheetDay.userWorkScheduleDay.dayDefinition.id}`).toDate(),
              };
            } else {
              userTimesheetDayList[userTimesheetDay.id] = {
                id: userTimesheetDay.id,
                title: userTimesheetDay.presenceType.name,
                start: moment(`${userTimesheetDay.userWorkScheduleDay.dayDefinition.id} ${userTimesheetDay.dayStartTime}:00`)
                  .toDate(),
                end: moment(`${userTimesheetDay.userWorkScheduleDay.dayDefinition.id} ${userTimesheetDay.dayEndTime}:00`)
                  .toDate(),
              };
            }
          });

          setMyEventsList(userTimesheetDayList);
        });

      apiService.get('users/activeWorkSchedule')
        .then((result) => {
          const scheduleDays = {};
          result.forEach((day) => {
            const dayId = day.dayDefinition.id;

            scheduleDays[dayId] = {
              ...day,
              dayStartTimeFromDate: day.dayStartTimeFrom !== null
                ? new Date(`${dayId}T${day.dayStartTimeFrom}:00`)
                : null,
              dayStartTimeToDate: day.dayStartTimeTo !== null
                ? new Date(`${dayId}T${day.dayStartTimeTo}:00`)
                : null,
              dayEndTimeFromDate: day.dayEndTimeFrom !== null
                ? new Date(`${dayId}T${day.dayEndTimeFrom}:00`)
                : null,
              dayEndTimeToDate: day.dayEndTimeTo !== null
                ? new Date(`${dayId}T${day.dayEndTimeTo}:00`)
                : null,
            };
          });

          setActiveWorkScheduleDay(scheduleDays);
        });
    },
    [],
  );

  const customDayPropGetter = (date) => {
    const dateString = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if (calendarState.view !== Views.MONTH || !activeWorkScheduleDayList[dateString]) {
      return {};
    }

    if (activeWorkScheduleDayList[dateString].workingDay) {
      return {
        className: 'working-day',
        style: {
          border: 'solid 2px #62ff6f',
          background: '#dbffdd',
        },
      };
    }
    return {};
  };

  const customSlotPropGetter = (date) => {
    const dateString = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if ((calendarState.view !== Views.WEEK && calendarState.view !== Views.DAY)
      || !activeWorkScheduleDayList[dateString]
    ) {
      return {};
    }

    const scheduleDay = activeWorkScheduleDayList[dateString];

    if (scheduleDay.workingDay
      && date >= scheduleDay.dayStartTimeFromDate
      && date < scheduleDay.dayStartTimeToDate
    ) {
      return {
        className: 'working-day',
        style: {
          background: '#dbffdd',
        },
      };
    }

    if (scheduleDay.workingDay
      && date >= scheduleDay.dayEndTimeFromDate
      && date < scheduleDay.dayEndTimeToDate
    ) {
      return {
        className: 'working-day',
        style: {
          background: '#dbffdd',
        },
      };
    }

    if (scheduleDay.workingDay
      && date >= scheduleDay.dayStartTimeToDate
      && date < scheduleDay.dayEndTimeFromDate
    ) {
      return {
        className: 'working-day',
        style: {
          background: '#fffec9',
        },
      };
    }

    return {};
  };

  const handleOnView = (event) => {
    setCalendarState(s => ({ ...s, view: event }));
  };

  const handleCloseDialog = (reload) => {
    setOpenEditDialog(false);
    setUserId(0);

    if (reload) {
      tableRef.current.onQueryChange();
    }
  };

  return (
    <div className={classes.mainCalendar}>
      <Calendar
        selectable
        localizer={localizer}
        culture="pl"
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        view={calendarState.view}
        onView={handleOnView}
        dayPropGetter={customDayPropGetter}
        slotPropGetter={customSlotPropGetter}
        min={moment('2019-07-19 06:00:00').toDate()}
        max={moment('2019-07-19 20:00:00').toDate()}
        style={{ height: 'calc(100vh - 150px)' }}
      />
      {openEditDialog
      && <EditUser userId={userId} open={openEditDialog} onClose={handleCloseDialog} />}
    </div>
  );
}

function mapStateToProps(state) {
  return {};
}

const connectedUserCalendar = connect(mapStateToProps)(UserCalendarComp);
export { connectedUserCalendar as UserCalendar };
