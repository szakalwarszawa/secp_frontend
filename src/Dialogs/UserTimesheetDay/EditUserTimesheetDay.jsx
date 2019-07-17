import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ImputLabel from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import {
  KeyboardTimePicker,
} from '@material-ui/pickers';

import { apiService } from '../../_services';

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
      owner: {},
    },
    userWorkScheduleDay: {
      dayDefinition: {},
    },
    presenceType: {
      id: -1,
    },
    absenceType: {},
  });
  const [presences, setPresences] = useState([]);
  const [absences, setAbsences] = useState([]);
  const isLoading = Boolean(state.loaderWorkerCount > 0);
  const workingTime = !!userTimesheetDayData.dayEndTime && !!userTimesheetDayData.dayStartTime
    ? ((userTimesheetDayData.dayEndTime - userTimesheetDayData.dayStartTime) / 3600000).toFixed(2)
    : 0;
  const isAbsence = Boolean(userTimesheetDayData.presenceType.isAbsence);
  const isTimed = Boolean(userTimesheetDayData.presenceType.isTimed);

  useEffect(
    () => {
      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get(`user_timesheet_days/${userTimesheetDayId}`)
        .then((result) => {
          const dayStartTimeDate = result.dayStartTime !== null
            ? new Date(`2000-01-01T${result.dayStartTime}:00`)
            : null;
          const dayEndTimeDate = result.dayEndTime !== null
            ? new Date(`2000-01-01T${result.dayEndTime}:00`)
            : null;

          setUserTimesheetDayData({
            ...result,
            presenceTypeId: result.presenceType !== null ? result.presenceType.id : null,
            absenceTypeId: result.absenceType !== null ? result.absenceType.id : null,
            dayStartTime: dayStartTimeDate,
            dayEndTime: dayEndTimeDate,
          });
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });

      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get('presence_types?_order[name]=asc&active=true')
        .then((result) => {
          setPresences(result['hydra:member']);
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });
      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));

      apiService.get('absence_types?_order[name]=asc&active=true')
        .then((result) => {
          setAbsences(result['hydra:member']);
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });
    },
    [userTimesheetDayId],
  );

  const handlePresenceChange = (field, date) => {
    const activePresence = presences.filter(
      presence => presence.id === date,
    );

    setUserTimesheetDayData({
      ...userTimesheetDayData,
      [field]: date,
      presenceType: activePresence[0],
    });
  };

  const handleInputChange = (field, date) => {
    setUserTimesheetDayData({ ...userTimesheetDayData, [field]: date });
  };

  const closeDialogHandler = () => onClose(false);

  const saveDialogHandler = () => {
    const payload = {
      presenceType: `/api/presence_types/${userTimesheetDayData.presenceTypeId}`,
      absenceType: isAbsence ? `/api/absence_types/${userTimesheetDayData.absenceTypeId}` : null,
      dayStartTime: isTimed
        ? userTimesheetDayData.dayStartTime.toLocaleTimeString(
          'pl-PL',
          { hour: '2-digit', minute: '2-digit' },
        )
        : null,
      dayEndTime: isTimed
        ? userTimesheetDayData.dayEndTime.toLocaleTimeString(
          'pl-PL',
          { hour: '2-digit', minute: '2-digit' },
        )
        : null,
      workingTime: isTimed && !Number.isNaN(workingTime) ? workingTime.toString() : '0',
    };

    setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
    apiService.put(`user_timesheet_days/${userTimesheetDayId}`, payload)
      .then(
        () => {
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
          onClose(true);
        },
        (error) => {
          setState({
            ...state,
            requestError: error,
          });
        },
      );
  };

  function getTimePicker(label, fieldName) {
    return (
      <FormControl component="div" className={classes.formControl} disabled={isLoading}>
        <KeyboardTimePicker
          label={label}
          margin="normal"
          id={fieldName}
          ampm={false}
          cancelLabel="Anuluj"
          okLabel="Ustaw"
          invalidDateMessage="Nieprawidłowy format czasu"
          value={userTimesheetDayData[fieldName]}
          onChange={date => handleInputChange(fieldName, date)}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </FormControl>
    );
  }

  return (
    <div className={classes.main}>
      <Dialog open={open} onClose={closeDialogHandler} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="form-dialog-title">Edycja dnia pracy</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <div>{`${userTimesheetDayData.userTimesheet.owner.lastName} ${userTimesheetDayData.userTimesheet.owner.firstName}`}</div>
            <div>
              {userTimesheetDayData.userTimesheet.owner.department
                ? userTimesheetDayData.userTimesheet.owner.department.name
                : ''}
              {userTimesheetDayData.userTimesheet.owner.section
                ? (` / ${userTimesheetDayData.userTimesheet.owner.section.name}`)
                : ''}
            </div>
            <div>{userTimesheetDayData.userWorkScheduleDay.dayDefinition.id}</div>
          </DialogContentText>

          <FormControl component="div" className={classes.formControl} disabled={isLoading}>
            <InputLabel htmlFor="presenceTypeId">Obecność</InputLabel>
            <Select
              value={userTimesheetDayData.presenceTypeId || -1}
              onChange={event => handlePresenceChange(event.target.name, event.target.value)}
              inputProps={{
                name: 'presenceTypeId',
                id: 'presenceTypeId',
              }}
            >
              {presences.map(presence => (
                <MenuItem button componet="li" key={presence.name} value={presence.id}>
                  {presence.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isAbsence && (
            <FormControl component="div" className={classes.formControl} disabled={isLoading}>
              <InputLabel htmlFor="absenceTypeId">Przyczyna nieobecności</InputLabel>
              <Select
                value={userTimesheetDayData.absenceTypeId || -1}
                onChange={event => handleInputChange(event.target.name, event.target.value)}
                inputProps={{
                  name: 'absenceTypeId',
                  id: 'absenceTypeId',
                }}
              >
                {absences.map(absence => (
                  <MenuItem button componet="li" key={absence.name} value={absence.id}>
                    {absence.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {!isAbsence && isTimed && getTimePicker('Rozpoczęcie pracy od', 'dayStartTime')}
          {!isAbsence && isTimed && getTimePicker('Zakończenie pracy do', 'dayEndTime')}

          {!isAbsence && isTimed && (
            <FormControl component="div" className={classes.formControl} disabled={isLoading}>
              <ImputLabel htmlFor="input-workingTime">
                {/*{`Czas pracy: ${workingTime} godz.`}*/}
                {`Czas pracy: ${!Number.isNaN(workingTime) ? workingTime : 0} godz.`}
              </ImputLabel>
            </FormControl>
          )}

          <Paper
            hidden={state.requestError === null || state.requestError === ''}
            className={classes.errorBox}
            elevation={5}
          >
            {state.requestError}
          </Paper>
        </DialogContent>
        <div className={classes.progressBarWrapper}>
          {isLoading && <LinearProgress />}
        </div>
        <DialogActions>
          <Button href="" onClick={closeDialogHandler} color="primary">
            Anuluj
          </Button>
          <Button href="" onClick={saveDialogHandler} color="primary" disabled={isLoading}>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  formControl: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(),
  },
  progressBarWrapper: {
    margin: 0,
    position: 'relative',
  },
  errorBox: {
    padding: theme.spacing(),
    marginTop: theme.spacing(),
    background: theme.palette.error.main,
  },
});

EditUserTimesheetDayComp.propTypes = {
  open: PropTypes.bool.isRequired,
  userTimesheetDayId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
};

EditUserTimesheetDayComp.defaultProps = {
  classes: {},
};

function mapStateToProps(state) {
  // const {} = state;
  return {};
}

const styledEditUserTimesheetDay = withStyles(styles)(EditUserTimesheetDayComp);
const connectedEditUserTimesheetDay = connect(mapStateToProps)(styledEditUserTimesheetDay);
export { connectedEditUserTimesheetDay as EditUserTimesheetDay };
