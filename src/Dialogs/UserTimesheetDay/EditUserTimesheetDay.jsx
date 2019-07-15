import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ImputLabel from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
  });
  const [userTimesheetDayData, setUserTimesheetDayData] = useState({
    userTimesheet: {
      owner: {},
    },
  });
  const [presences, setPresences] = useState({});
  const [absences, setAbsences] = useState({});
  const isLoading = Boolean(state.loaderWorkerCount > 0);

  useEffect(
    () => {
      setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
      apiService.get(`user_timesheet_days/${userTimesheetDayId}`)
        .then((result) => {
          console.log(result);
          setUserTimesheetDayData({
            ...result,
          });
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
        });

      setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
      apiService.get('absence_types')
        .then((result) => {
          const absenceList = {};
          result['hydra:member'].forEach((absence) => {
            absenceList[absence.id] = absence.name;
          });
          setAbsences(absenceList);
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
        });

      setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
      apiService.get('presence_types')
        .then((result) => {
          const presenceList = {};
          result['hydra:member'].forEach((presence) => {
            presenceList[presence.id] = presence.name;
          });
          setPresences(presenceList);
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
        });
    },
    [userTimesheetDayId],
  );

  const handleInputChange = (field, date) => {
    setUserTimesheetDayData({ ...userTimesheetDayData, [field]: date });
  };

  const closeDialogHandler = () => onClose(false);

  const saveDialogHandler = () => {
    const payload = {
      defaultWorkScheduleProfile: `/api/work_schedule_profiles/${userTimesheetDayData.defaultWorkScheduleProfileId}`,
      dayStartTimeFrom: userTimesheetDayData.dayStartTimeFromDate.toLocaleTimeString(
        'pl-PL',
        { hour: '2-digit', minute: '2-digit' },
      ),
      dayStartTimeTo: userTimesheetDayData.dayStartTimeToDate.toLocaleTimeString(
        'pl-PL',
        { hour: '2-digit', minute: '2-digit' },
      ),
      dayEndTimeFrom: userTimesheetDayData.dayEndTimeFromDate.toLocaleTimeString(
        'pl-PL',
        { hour: '2-digit', minute: '2-digit' },
      ),
      dayEndTimeTo: userTimesheetDayData.dayEndTimeToDate.toLocaleTimeString(
        'pl-PL',
        { hour: '2-digit', minute: '2-digit' },
      ),
      dailyWorkingTime: userTimesheetDayData.dailyWorkingTime.toString(),
    };

    setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
    apiService.put(`user_timesheet_days/${userTimesheetDayId}`, payload)
      .then(() => {
        setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
        onClose(true);
      });
  };

  function getTimePicker(label, fieldName) {
    return (
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
    );
  }

  return (
    <div className={classes.main}>
      <Dialog open={open} onClose={closeDialogHandler} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="form-dialog-title">Edycja dnia pracy</DialogTitle>
        <DialogContent hidden={isLoading}>
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
          </DialogContentText>
          {/*  <FormControl component="div" className={classes.formControl}>*/}
          {/*    <InputLabel htmlFor="default-work-schedule-profile">Domyślny profil harmonogramu</InputLabel>*/}
          {/*    <Select*/}
          {/*      value={userTimesheetDayData.defaultWorkScheduleProfileId || -1}*/}
          {/*      onChange={event => handleInputChange(event.target.name, event.target.value)}*/}
          {/*      inputProps={{*/}
          {/*        name: 'defaultWorkScheduleProfileId',*/}
          {/*        id: 'default-work-schedule-profile',*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      {workScheduleProfiles.map(workScheduleProfile => (*/}
          {/*        <MenuItem button componet="li" key={workScheduleProfile.name} value={workScheduleProfile.id}>*/}
          {/*          {workScheduleProfile.name}*/}
          {/*        </MenuItem>*/}
          {/*      ))}*/}
          {/*    </Select>*/}
          {/*    {getTimePicker('Rozpoczęcie pracy od', 'dayStartTimeFromDate')}*/}
          {/*    {getTimePicker('Rozpoczęcie pracy do', 'dayStartTimeToDate')}*/}
          {/*    {getTimePicker('Zakończenie pracy od', 'dayEndTimeFromDate')}*/}
          {/*    {getTimePicker('Zakończenie pracy od', 'dayEndTimeToDate')}*/}
          {/*    <ImputLabel htmlFor="input-working-time">{`Czas pracy: ${userTimesheetDayData.dailyWorkingTime} godz.`}</ImputLabel>*/}
          {/*    <Slider*/}
          {/*      value={userTimesheetDayData.dailyWorkingTime * 100}*/}
          {/*      onChange={(event, newValue) => handleInputChange('dailyWorkingTime', newValue / 100)}*/}
          {/*      aria-labelledby="input-working-time"*/}
          {/*      step={50}*/}
          {/*      min={0}*/}
          {/*      max={2400}*/}
          {/*    />*/}
          {/*  </FormControl>*/}
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
