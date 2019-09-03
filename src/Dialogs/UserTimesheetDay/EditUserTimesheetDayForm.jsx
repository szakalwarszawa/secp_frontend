import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
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
    createMode,
  } = props;

  const [state, setState] = useState({
    loaderWorkerCount: 0,
    requestError: null,
    submitted: false,
    error: {
      wrongTimeOrder: false,
      wrongDayStartSlot: false,
      wrongDayEndSlot: false,
      wrongWorkingTime: false,
    },
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
  const userWorkScheduleDay = useRef({
    workingDay: false,
    timeAdjust: false,
  });
  const isLoading = Boolean(state.loaderWorkerCount > 0);
  const workingTime = !!userTimesheetDayData.dayEndTime && !!userTimesheetDayData.dayStartTime
    ? ((userTimesheetDayData.dayEndTime - userTimesheetDayData.dayStartTime) / 3600000).toFixed(2)
    : 0;
  const isAbsence = Boolean(userTimesheetDayData.presenceType.isAbsence);
  const isTimed = Boolean(userTimesheetDayData.presenceType.isTimed);
  const editRestrictions = {
    EDIT_RESTRICTION_ALL: 0,
    EDIT_RESTRICTION_TODAY: 1,
    EDIT_RESTRICTION_BEFORE_TODAY: 2,
    EDIT_RESTRICTION_AFTER_TODAY: 3,
    EDIT_RESTRICTION_BEFORE_AND_TODAY: 4,
    EDIT_RESTRICTION_AFTER_AND_TODAY: 5,
  };
  const workingDayRestrictions = {
    WORKING_AND_NON_WORKING_DAY: 0,
    WORKING_DAY:1,
    NON_WORKING_DAY: 2,
  };

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

      if (!userTimesheetDay.timesheetDayDate) {
        return;
      }

      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get('absence_types?_order[name]=asc&active=true')
        .then((result) => {
          setAbsences(result['hydra:member']);
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });

      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get(`user_work_schedule_days/own/active/${userTimesheetDay.timesheetDayDate}/${userTimesheetDay.timesheetDayDate}`)
        .then(
          (result) => {
            const day = result['hydra:member'][0];
            const dayId = day.dayDefinition.id;
            const dayStartTimeFromDate = day.dayStartTimeFrom !== null
              ? new Date(`${dayId}T${day.dayStartTimeFrom}:00`)
              : null;
            const dayStartTimeToDate = day.dayStartTimeTo !== null
              ? new Date(`${dayId}T${day.dayStartTimeTo}:00`)
              : null;
            const dayEndTimeFromDate = day.dayEndTimeFrom !== null
              ? new Date(`${dayId}T${day.dayEndTimeFrom}:00`)
              : null;
            const dayEndTimeToDate = day.dayEndTimeTo !== null
              ? new Date(`${dayId}T${day.dayEndTimeTo}:00`)
              : null;
            const timeAdjust = !moment(dayStartTimeFromDate).isSame(dayStartTimeToDate, 'minute')
              || !moment(dayEndTimeFromDate).isSame(dayEndTimeToDate, 'minute');

            if (!timeAdjust) {
              setUserTimesheetDayData(s => ({
                ...s,
                dayStartTime: dayStartTimeFromDate,
                dayEndTime: dayEndTimeFromDate,
              }));
            }

            userWorkScheduleDay.current = {
              ...day,
              dayStartTimeFromDate,
              dayStartTimeToDate,
              dayEndTimeFromDate,
              dayEndTimeToDate,
              timeAdjust,
            };

            setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          },
          (error) => {
            setState(s => ({
              ...s,
              loaderWorkerCount: s.loaderWorkerCount - 1,
              requestError: error,
            }));
          },
        ).then(
          async => {
            setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
            apiService.get('presence_types?_order[name]=asc&active=true')
              .then((result) => {
                let presenceTypes = result['hydra:member'];
                let isWorkingDay = userWorkScheduleDay.current.workingDay;

                presenceTypes = presenceTypes.filter((presence) => {
                  const presenceRestriction = createMode
                    ? presence.createRestriction
                    : presence.editRestriction;

                  if (!createMode && userTimesheetDay.presenceTypeId === presence.id) {
                    return true;
                  }

                  if (
                    presence.workingDayRestriction === workingDayRestrictions.WORKING_DAY
                    && isWorkingDay !== true
                  ) {
                    return false;
                  }

                  if (
                    presence.workingDayRestriction === workingDayRestrictions.NON_WORKING_DAY
                    && isWorkingDay !== false
                  ) {
                    return false;
                  }

                  switch (presenceRestriction) {
                    case editRestrictions.EDIT_RESTRICTION_ALL:
                      return true;
                    case editRestrictions.EDIT_RESTRICTION_TODAY:
                      return moment(userTimesheetDay.timesheetDayDate).isSame(moment(), 'day');
                    case editRestrictions.EDIT_RESTRICTION_AFTER_TODAY:
                      return moment(userTimesheetDay.timesheetDayDate).isAfter(moment(), 'day');
                    case editRestrictions.EDIT_RESTRICTION_BEFORE_TODAY:
                      return moment(userTimesheetDay.timesheetDayDate).isBefore(moment(), 'day');
                    case editRestrictions.EDIT_RESTRICTION_AFTER_AND_TODAY:
                      return moment(userTimesheetDay.timesheetDayDate).isSameOrAfter(moment(), 'day');
                    case editRestrictions.EDIT_RESTRICTION_BEFORE_AND_TODAY:
                      return moment(userTimesheetDay.timesheetDayDate).isSameOrBefore(moment(), 'day');
                    default:
                      return false;
                  }
                });

                setPresences(presenceTypes);
                setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
              });
          }
        )
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
    setState({ ...state, wrongTimeOrder: false });
  };

  const handleTimeInputChange = (field, date) => {
    let validDateTime = date;
    if (moment(date).isValid()) {
      validDateTime = moment(date)
        .set('year', moment(userTimesheetDayData.timesheetDayDate).get('year'))
        .set('month', moment(userTimesheetDayData.timesheetDayDate).get('month'))
        .set('date', moment(userTimesheetDayData.timesheetDayDate).get('date'))
        .toDate();
    }
    setUserTimesheetDayData({ ...userTimesheetDayData, [field]: validDateTime });
    setState({ ...state, wrongTimeOrder: false });
  };

  const closeDialogHandler = () => onClose(false);

  const validateForm = () => {
    if ((userTimesheetDayData.presenceTypeId <= 0)
      || (isAbsence && !userTimesheetDayData.absenceTypeId)
      || (
        !isAbsence
        && isTimed
        && (!userTimesheetDayData.dayStartTime || !userTimesheetDayData.dayEndTime)
      )
    ) {
      return false;
    }

    if (
      userTimesheetDayData.presenceType.workingDayRestriction === workingDayRestrictions.WORKING_DAY
      && userWorkScheduleDay.current.workingDay !== true
    ) {
      return false;
    }

    if (
      userTimesheetDayData.presenceType.workingDayRestriction === workingDayRestrictions.NON_WORKING_DAY
      && userWorkScheduleDay.current.workingDay !== false
    ) {
      return false;
    }

    if (!isAbsence && isTimed
      && moment(userTimesheetDayData.dayStartTime).isAfter(moment(userTimesheetDayData.dayEndTime), 'minute')
    ) {
      setState(s => ({ ...s, error: { wrongTimeOrder: true } }));
      return false;
    }

    if (!isAbsence && isTimed && userWorkScheduleDay.current.timeAdjust
      && !moment(userTimesheetDayData.dayStartTime)
        .isBetween(
          userWorkScheduleDay.current.dayStartTimeFromDate,
          userWorkScheduleDay.current.dayStartTimeToDate,
          'minute',
          '[]'
        )
    ) {
      setState(s => ({ ...s, error: { wrongDayStartSlot: true } }));
      return false;
    }

    if (!isAbsence && isTimed && userWorkScheduleDay.current.timeAdjust
      && !moment(userTimesheetDayData.dayEndTime)
        .isBetween(
          userWorkScheduleDay.current.dayEndTimeFromDate,
          userWorkScheduleDay.current.dayEndTimeToDate,
          'minute',
          '[]'
        )
    ) {
      setState(s => ({ ...s, error: { wrongDayEndSlot: true } }));
      return false;
    }

    if (!isAbsence && isTimed && userWorkScheduleDay.current.timeAdjust
      && parseFloat(workingTime) !== parseFloat(userWorkScheduleDay.current.dailyWorkingTime)
    ) {
      setState(s => ({ ...s, error: { wrongWorkingTime: true } }));
      return false;
    }

    return true;
  };

  const saveDialogHandler = () => {
    setState(s => ({ ...s, submitted: true, isLoading: true }));

    if (!validateForm()) {
      return;
    }

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
          onChange={date => handleTimeInputChange(fieldName, date)}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
        {state.submitted && !userTimesheetDayData[fieldName] && (
          <FormHelperText error>
            Podanie czasu jest wymagane
          </FormHelperText>
        )}
        {fieldName === 'dayEndTime' && state.error.wrongTimeOrder && (
          <FormHelperText error>
            Czas zakończenia musi następować po czasie rozpoczęcia
          </FormHelperText>
        )}
        {fieldName === 'dayStartTime' && state.error.wrongDayStartSlot && (
          <FormHelperText error>
            Czas rozpoczęcia musi wystąpić w ustalonym przedziale
          </FormHelperText>
        )}
        {fieldName === 'dayEndTime' && state.error.wrongDayEndSlot && (
          <FormHelperText error>
            Czas zakończenia musi wystąpić w ustalonym przedziale
          </FormHelperText>
        )}
        {fieldName === 'dayEndTime' && state.error.wrongWorkingTime && (
          <FormHelperText error>
            Długość czasu pracy musi być zgodna z ustalonym harmonogramem
          </FormHelperText>
        )}
      </FormControl>
    );
  }

  return (
    <div className={classes.main}>
      <Dialog open={open} onClose={closeDialogHandler} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="form-dialog-title">{createMode ? 'Dodawanie dnia pracy' : 'Edycja dnia pracy'}</DialogTitle>
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
            <div>{userTimesheetDayData.timesheetDayDate}</div>
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
            {state.submitted && userTimesheetDayData.presenceTypeId <= 0 && (
              <FormHelperText error>
                Podanie obecności jest wymagane
              </FormHelperText>
            )}
            {
              state.submitted
              && userTimesheetDayData.presenceType.workingDayRestriction === workingDayRestrictions.WORKING_DAY
              && userWorkScheduleDay.current.workingDay !== true
              && (
              <FormHelperText error>
                Opcja dostępna tylko dla dni pracujących
              </FormHelperText>
            )}
            {
              state.submitted
              && userTimesheetDayData.presenceType.workingDayRestriction === workingDayRestrictions.NON_WORKING_DAY
              && userWorkScheduleDay.current.workingDay !== false
              && (
              <FormHelperText error>
                Opcja dostępna tylko dla dni niepracujących
              </FormHelperText>
            )}
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
              {state.submitted && !userTimesheetDayData.absenceTypeId && (
                <FormHelperText error>
                  Podanie rodzaju nieobecności jest wymagane
                </FormHelperText>
              )}
            </FormControl>
          )}

          {!isAbsence && isTimed && userWorkScheduleDay.current.timeAdjust && getTimePicker(
            'Rozpoczęcie pracy',
            'dayStartTime',
          )}
          {!isAbsence && isTimed && userWorkScheduleDay.current.timeAdjust && getTimePicker(
            'Zakończenie pracy',
            'dayEndTime',
          )}

          {!isAbsence && isTimed && (
            <FormControl component="div" className={classes.formControl}>
              <InputLabel>
                {`Czas pracy: ${!Number.isNaN(workingTime) && workingTime !== 'NaN' ? workingTime : 0} godz.`}
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
  createMode: PropTypes.bool,
};

EditUserTimesheetDayFormComp.defaultProps = {
  classes: {},
  requestError: '',
  createMode: false,
};

const mapStateToProps = state => ({});

const styledEditUserTimesheetDayForm = withStyles(styles)(EditUserTimesheetDayFormComp);
const connectedEditUserTimesheetDayForm = connect(mapStateToProps)(styledEditUserTimesheetDayForm);
export { connectedEditUserTimesheetDayForm as EditUserTimesheetDayForm };
