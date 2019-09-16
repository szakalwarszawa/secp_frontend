import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { EditUserTimesheetDayForm } from './EditUserTimesheetDayForm';
import { apiService } from '../../_services';
import moment from 'moment';

function EditUserTimesheetDayComp(props) {
  const {
    classes,
    open,
    userTimesheetDayId,
    onClose,
  } = props;

  const [state, setState] = useState({
    loaderWorkerCount: 0,
    requestError: null,
  });
  const [userTimesheetDayData, setUserTimesheetDayData] = useState({
    userTimesheet: {
      owner: {
        lastName: '',
        firstName: '',
      },
    },
    userWorkScheduleDay: {
      dayDefinition: {},
    },
    presenceType: {
      id: -1,
    },
    absenceType: {},
  });
  const isLoading = Boolean(state.loaderWorkerCount > 0);

  useEffect(
    () => {
      apiService.get(`user_timesheet_days/${userTimesheetDayId}`)
        .then((result) => {
          const dayStartTimeDate = result.dayStartTime !== null
            ? new Date(`${result.userWorkScheduleDay.dayDefinition.id}T${result.dayStartTime}:00`)
            : null;
          const dayEndTimeDate = result.dayEndTime !== null
            ? new Date(`${result.userWorkScheduleDay.dayDefinition.id}T${result.dayEndTime}:00`)
            : null;

          setUserTimesheetDayData({
            ...result,
            presenceTypeId: result.presenceType !== null ? result.presenceType.id : null,
            absenceTypeId: ('absenceType' in result) && result.absenceType !== null ? result.absenceType.id : null,
            dayStartTime: dayStartTimeDate,
            dayEndTime: dayEndTimeDate,
            timesheetDayDate: moment(result.userWorkScheduleDay.dayDefinition.id).format('YYYY-MM-DD'),
          });
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });
    },
    [userTimesheetDayId],
  );

  const saveDialogHandler = (savedData) => {
    const workingTime = !!savedData.dayEndTime && !!savedData.dayStartTime
      ? ((savedData.dayEndTime - savedData.dayStartTime) / 3600000).toFixed(2)
      : 0;
    const isAbsence = Boolean(savedData.presenceType.isAbsence);
    const isTimed = Boolean(savedData.presenceType.isTimed);

    const payload = {
      presenceType: `/api/presence_types/${savedData.presenceTypeId}`,
      absenceType: isAbsence && ('absenceType' in savedData) ? `/api/absence_types/${savedData.absenceTypeId}` : null,
      dayStartTime: isTimed
        ? savedData.dayStartTime.toLocaleTimeString(
          'pl-PL',
          { hour: '2-digit', minute: '2-digit' },
        )
        : null,
      dayEndTime: isTimed
        ? savedData.dayEndTime.toLocaleTimeString(
          'pl-PL',
          { hour: '2-digit', minute: '2-digit' },
        )
        : null,
      workingTime: isTimed && !Number.isNaN(workingTime)
        ? workingTime.toString()
        : '0',
    };

    setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
    apiService.put(`user_timesheet_days/${userTimesheetDayId}`, payload)
      .then(
        (result) => {
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
          onClose(true, result);
        },
        (error) => {
          setState({
            ...state,
            requestError: error,
          });
        },
      );
  };

  return (
    <EditUserTimesheetDayForm
      userTimesheetDay={userTimesheetDayData}
      open={open}
      onClose={onClose}
      onSave={saveDialogHandler}
      classes={classes}
      requestError={state.requestError}
    />
  );
}

const styles = theme => ({});

EditUserTimesheetDayComp.propTypes = {
  open: PropTypes.bool.isRequired,
  userTimesheetDayId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
};

EditUserTimesheetDayComp.defaultProps = {
  classes: {},
};

const mapStateToProps = (state) => ({});

const styledEditUserTimesheetDay = withStyles(styles)(EditUserTimesheetDayComp);
const connectedEditUserTimesheetDay = connect(mapStateToProps)(styledEditUserTimesheetDay);
export { connectedEditUserTimesheetDay as EditUserTimesheetDay };
