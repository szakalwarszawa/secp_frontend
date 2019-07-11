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

function EditUserComp(props) {
  const {
    classes,
    open,
    userId,
    onClose,
  } = props;

  const [state, setState] = useState({
    loaderWorkerCount: 0,
  });
  const [userData, setUserData] = useState({});
  const [workScheduleProfiles, setWorkScheduleProfiles] = useState([]);
  const isLoading = Boolean(state.loaderWorkerCount > 0);

  useEffect(
    () => {
      setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
      apiService.get('work_schedule_profiles')
        .then((result) => {
          setWorkScheduleProfiles(result['hydra:member']);
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
        });

      setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
      apiService.get(`users/${userId}`)
        .then((result) => {
          setUserData({
            ...result,
            defaultWorkScheduleProfileId: result.defaultWorkScheduleProfile.id,
            dayStartTimeFromDate: new Date(`2000-01-01T${result.dayStartTimeFrom}:00`),
            dayStartTimeToDate: new Date(`2000-01-01T${result.dayStartTimeTo}:00`),
            dayEndTimeFromDate: new Date(`2000-01-01T${result.dayEndTimeFrom}:00`),
            dayEndTimeToDate: new Date(`2000-01-01T${result.dayEndTimeTo}:00`),
          });
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
        });
    },
    [userId],
  );

  const handleDateTimeChange = (field, date) => {
    setUserData({ ...userData, [field]: date });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const closeDialogHandler = () => onClose(false);
  const saveDialogHandler = () => {
    const payload = {
      defaultWorkScheduleProfile: `/api/work_schedule_profiles/${userData.defaultWorkScheduleProfileId}`,
    };

    setState({ ...state, loaderWorkerCount: state.loaderWorkerCount + 1 });
    apiService.put(`users/${userId}`, payload)
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
        value={userData[fieldName]}
        onChange={date => handleDateTimeChange(fieldName, date)}
        KeyboardButtonProps={{
          'aria-label': 'change time',
        }}
      />
    );
  }

  return (
    <div className={classes.main}>
      <Dialog open={open} onClose={closeDialogHandler} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="form-dialog-title">Edycja użytkownika</DialogTitle>
        <DialogContent hidden={isLoading}>
          <DialogContentText>
            <div>{`${userData.lastName} ${userData.firstName}`}</div>
            <div>
              {userData.department ? userData.department.name : ''}
              {userData.section ? (` / ${userData.section.name}`) : ''}
            </div>
          </DialogContentText>
          <FormControl component="div" className={classes.formControl}>
            <InputLabel htmlFor="default-work-schedule-profile">Domyślny profil harmonogramu</InputLabel>
            <Select
              value={userData.defaultWorkScheduleProfileId || -1}
              onChange={handleChange}
              inputProps={{
                name: 'defaultWorkScheduleProfileId',
                id: 'default-work-schedule-profile',
              }}
            >
              {workScheduleProfiles.map(workScheduleProfile => (
                <MenuItem button componet="li" key={workScheduleProfile.name} value={workScheduleProfile.id}>
                  {workScheduleProfile.name}
                </MenuItem>
              ))}
            </Select>
            {getTimePicker('Rozpoczęcie pracy od', 'dayStartTimeFromDate')}
            {getTimePicker('Rozpoczęcie pracy do', 'dayStartTimeToDate')}
            {getTimePicker('Zakończenie pracy od', 'dayEndTimeFromDate')}
            {getTimePicker('Zakończenie pracy od', 'dayEndTimeToDate')}
            <ImputLabel htmlFor="input-working-time">{`Czas pracy: ${userData.dailyWorkingTime} g.`}</ImputLabel>
            <Slider
              value={userData.dailyWorkingTime * 100}
              onChange={(event, newValue) => handleDateTimeChange('dailyWorkingTime', newValue / 100)}
              aria-labelledby="input-working-time"
              step={50}
              min={0}
              max={2400}
            />
          </FormControl>
          {isLoading && <LinearProgress />}
        </DialogContent>
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
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  buttonWrapper: {
    margin: theme.spacing(),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  textField: {},
  formControl: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

EditUserComp.propTypes = {
  open: PropTypes.bool.isRequired,
  userId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
};

EditUserComp.defaultProps = {
  classes: {},
};

function mapStateToProps(state) {
  // const {} = state;
  return {};
}

const styledEditUser = withStyles(styles)(EditUserComp);
const connectedEditUser = connect(mapStateToProps)(styledEditUser);
export { connectedEditUser as EditUser };
