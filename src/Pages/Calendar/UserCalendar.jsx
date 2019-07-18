import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Calendar, momentLocalizer } from 'react-big-calendar';
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
                start: moment(`${userTimesheetDay.userWorkScheduleDay.dayDefinition.id} ${userTimesheetDay.dayStartTime}:00`).toDate(),
                end: moment(`${userTimesheetDay.userWorkScheduleDay.dayDefinition.id} ${userTimesheetDay.dayEndTime}:00`).toDate(),
              };
            }
          });

          setMyEventsList(userTimesheetDayList);
        });
    },
    [],
  );

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
        localizer={localizer}
        culture="pl"
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
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
