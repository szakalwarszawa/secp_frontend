import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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

function EditUserTimesheetDayFormComp(props) {
  const {
    classes,
    open,
    userTimesheetDay,
    onSave,
    onClose,
    requestError,
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
      setUserTimesheetDayData({
        ...userTimesheetDay,
        presenceTypeId: userTimesheetDay.presenceType !== null
          ? userTimesheetDay.presenceType.id
          : null,
        absenceTypeId: userTimesheetDay.absenceType !== null
          ? userTimesheetDay.absenceType.id
          : null,
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
    [userTimesheetDay],
  );

  useEffect(
    () => {
      setState(s => ({ ...s, requestError }));
    },
    [requestError],
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
    onSave(userTimesheetDayData);
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
              <InputLabel htmlFor="input-workingTime">
                {`Czas pracy: ${!Number.isNaN(workingTime) ? workingTime : 0} godz.`}
              </InputLabel>
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

EditUserTimesheetDayFormComp.propTypes = {
  open: PropTypes.bool.isRequired,
  userTimesheetDay: PropTypes.instanceOf(Object).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
  requestError: PropTypes.string,
};

EditUserTimesheetDayFormComp.defaultProps = {
  classes: {},
  requestError: '',
};

function mapStateToProps(state) {
  // const {} = state;
  return {};
}

const styledEditUserTimesheetDayForm = withStyles(styles)(EditUserTimesheetDayFormComp);
const connectedEditUserTimesheetDayForm = connect(mapStateToProps)(styledEditUserTimesheetDayForm);
export { connectedEditUserTimesheetDayForm as EditUserTimesheetDayForm };
