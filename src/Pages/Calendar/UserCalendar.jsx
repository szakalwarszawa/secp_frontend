import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pl';
import { lightGreen, amber } from '@material-ui/core/colors';
import { Chip, Avatar, Grid } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { apiService } from '../../_services';
import { EditUserTimesheetDay, CreateUserTimesheetDay } from '../../Dialogs/UserTimesheetDay';

const flexibleHoursColor = lightGreen[200];
const fixedHoursColor = amber[200];
const useStyles = makeStyles(theme => ({
  mainCalendar: {
    width: '100%',
    marginRight: '45px',
  },
  legendAvatar: {
    backgroundColor: 'transparent',
  },
  chip: {
    margin: theme.spacing(0.2),
  },
}));

function UserCalendarComp(props) {
  const calculateViewRange = (currentDate, currentView) => {
    let start;
    let end;

    if (currentView === Views.DAY) {
      start = moment(currentDate).startOf('day');
      end = moment(currentDate).endOf('day');
    } else if (currentView === Views.WEEK) {
      start = moment(currentDate).startOf('isoWeek');
      end = moment(currentDate).endOf('isoWeek');
    } else if (currentView === Views.MONTH) {
      start = moment(currentDate).startOf('month').subtract(7, 'days');
      end = moment(currentDate).endOf('month').add(7, 'days');
    } else if (currentView === Views.AGENDA) {
      start = moment(currentDate).startOf('day');
      end = moment(currentDate).endOf('day').add(1, 'month');
    }

    return {
      viewFrom: start,
      viewTo: end,
    };
  };

  const prepareDataEvent = (dayData) => {
    if (dayData.dayStartTime === null) {
      return {
        id: dayData.id,
        allDay: true,
        title: dayData.presenceType.name,
        start: moment(`${dayData.userWorkScheduleDay.dayDefinition.id}`).toDate(),
        end: moment(`${dayData.userWorkScheduleDay.dayDefinition.id}`).toDate(),
      };
    }
    return {
      id: dayData.id,
      title: dayData.presenceType.name,
      start: moment(`${dayData.userWorkScheduleDay.dayDefinition.id} ${dayData.dayStartTime}:00`)
        .toDate(),
      end: moment(`${dayData.userWorkScheduleDay.dayDefinition.id} ${dayData.dayEndTime}:00`)
        .toDate(),
    };
  };

  const classes = useStyles();
  const localizer = momentLocalizer(moment);
  const [calendarState, setCalendarState] = useState({
    currentView: Views.WEEK,
    currentDate: moment(),
    viewFrom: calculateViewRange(moment(), Views.WEEK).viewFrom,
    viewTo: calculateViewRange(moment(), Views.WEEK).viewTo,
  });
  const [activeWorkScheduleDayList, setActiveWorkScheduleDay] = useState([]);
  const [myEventsList, setMyEventsList] = useState([]);
  const initialTableLegendState = {
    flexibleWorkingHours: false,
    fixedWorkingHours: false,
  };
  const [tableLegend, setTableLegend] = useState(initialTableLegendState);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [userTimesheetDayId, setUserTimesheetDayId] = useState(0);
  const [createdSelection, setCreatedSelection] = useState({ start: null, end: null });

  useEffect(
    () => {
      const viewFrom = moment(calendarState.viewFrom).format('YYYY-MM-DD');
      const viewTo = moment(calendarState.viewTo).format('YYYY-MM-DD');

      apiService.get(`user_timesheet_days/own/${viewFrom}/${viewTo}`)
        .then((result) => {
          const userTimesheetDayList = [];
          result['hydra:member'].forEach((userTimesheetDay) => {
            userTimesheetDayList[prepareDataEvent(userTimesheetDay).id] = prepareDataEvent(
              userTimesheetDay,
            );
          });

          setMyEventsList(userTimesheetDayList);
        });

      apiService.get(`user_work_schedule_days/own/active/${viewFrom}/${viewTo}`)
        .then((result) => {
          const scheduleDays = {};
          result['hydra:member'].forEach((day) => {
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

          setTableLegend(initialTableLegendState);
          setActiveWorkScheduleDay(scheduleDays);
        });
    },
    [calendarState],
  );

  const customDayPropGetter = (date) => {
    const dateString = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if (calendarState.currentView !== Views.MONTH || !activeWorkScheduleDayList[dateString]) {
      return {};
    }

    if (activeWorkScheduleDayList[dateString].workingDay) {
      return {
        className: 'working-day',
        style: {
          border: '2px solid #62ff6f',
          backgroundColor: flexibleHoursColor,
        },
      };
    }
    return {};
  };

  const customSlotPropGetter = (date) => {
    const dateString = `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if ((calendarState.currentView !== Views.WEEK && calendarState.currentView !== Views.DAY)
      || !activeWorkScheduleDayList[dateString]
    ) {
      return {};
    }

    const scheduleDay = activeWorkScheduleDayList[dateString];
    const isFlexibleWorkingHoursDay = !moment(scheduleDay.dayStartTimeFromDate).isSame(scheduleDay.dayStartTimeToDate);

    if (
      isFlexibleWorkingHoursDay
      && !tableLegend.flexibleWorkingHours
    ) {
      setTableLegend({
        ...tableLegend,
        flexibleWorkingHours: true,
      });
    } else if (!tableLegend.fixedWorkingHours) {
      setTableLegend({
        ...tableLegend,
        fixedWorkingHours: true,
      });
    }

    if (scheduleDay.workingDay
      && date >= scheduleDay.dayStartTimeFromDate
      && date < scheduleDay.dayStartTimeToDate
    ) {
      return {
        className: 'working-day',
        style: {
          background: flexibleHoursColor,
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
          background: flexibleHoursColor,
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
          background: isFlexibleWorkingHoursDay ? flexibleHoursColor : fixedHoursColor,
        },
      };
    }

    return {};
  };

  const handleOnView = (view) => {
    const { viewFrom, viewTo } = calculateViewRange(calendarState.currentDate, view);
    setCalendarState(s => ({
      ...s, viewFrom, viewTo, currentView: view,
    }));
  };

  const handleOnNavigate = (date, view) => {
    const { viewFrom, viewTo } = calculateViewRange(date, view);
    setCalendarState(s => ({
      ...s, viewFrom, viewTo, currentView: view, currentDate: date,
    }));
  };

  const handleOnSelectSlot = (event) => {
    const selectedTimesheetDay = myEventsList.filter(f => moment(f.start).isSame(moment(event.start), 'day'));
    if (selectedTimesheetDay[0]) {
      setUserTimesheetDayId(selectedTimesheetDay[0].id);
      setOpenEditDialog(true);
      return;
    }

    setCreatedSelection({ start: event.start, end: event.end });
    setOpenCreateDialog(true);
  };

  const handleOnSelectEvent = (event) => {
    setUserTimesheetDayId(event.id);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = (reload, dayData) => {
    setOpenEditDialog(false);
    setOpenCreateDialog(false);
    setUserTimesheetDayId(0);
    setCreatedSelection({});

    if (reload && dayData) {
      const newEventList = myEventsList.slice(0);
      newEventList[prepareDataEvent(dayData).id] = prepareDataEvent(dayData);
      setMyEventsList(newEventList);
    }
  };

  return (
    <div className={classes.mainCalendar}>
      <Grid container justify="center">
        {tableLegend.flexibleWorkingHours && (
          <Chip
            className={classes.chip}
            avatar={(
              <Avatar className={classes.legendAvatar}>
                <FiberManualRecordIcon htmlColor={flexibleHoursColor} />
              </Avatar>
            )}
            label="Ruchome godziny pracy"
            variant="outlined"
            size="small"
          />
        )}
        {tableLegend.fixedWorkingHours && (
          <Chip
            className={classes.chip}
            avatar={(
              <Avatar className={classes.legendAvatar}>
                <FiberManualRecordIcon htmlColor={fixedHoursColor} />
              </Avatar>
            )}
            label="Stałe godziny pracy"
            variant="outlined"
            size="small"
          />
        )}
      </Grid>
      <Calendar
        selectable
        localizer={localizer}
        culture="pl"
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        view={calendarState.currentView}
        onView={handleOnView}
        onNavigate={handleOnNavigate}
        onSelectEvent={handleOnSelectEvent}
        onSelectSlot={handleOnSelectSlot}
        dayPropGetter={customDayPropGetter}
        slotPropGetter={customSlotPropGetter}
        getNow={() => moment().add(30, 'minutes')}
        min={moment('2019-07-19 06:00:00').toDate()}
        max={moment('2019-07-19 20:00:00').toDate()}
        style={{ height: 'calc(100vh - 150px)' }}
      />
      {openEditDialog && (
        <EditUserTimesheetDay
          userTimesheetDayId={userTimesheetDayId}
          open={openEditDialog}
          onClose={handleCloseEditDialog}
        />
      )}
      {openCreateDialog && (
        <CreateUserTimesheetDay
          timeFrom={createdSelection.start}
          timeTo={createdSelection.end}
          open={openCreateDialog}
          onClose={handleCloseEditDialog}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({});

const connectedUserCalendar = connect(mapStateToProps)(UserCalendarComp);
export { connectedUserCalendar as UserCalendar };
