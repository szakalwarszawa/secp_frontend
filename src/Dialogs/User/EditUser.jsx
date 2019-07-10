import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  KeyboardTimePicker,
} from '@material-ui/pickers';

import { userActions } from '../../_actions';
import { apiService } from '../../_services';

function EditUserComp(props) {
  const {
    classes,
    open,
    userId,
    onClose,
  } = props;

  const [state, setState] = useState({});
  const [workScheduleProfiles, setWorkScheduleProfiles] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(
    () => {
      apiService.get('work_schedule_profiles')
        .then((result) => {
          setWorkScheduleProfiles(result['hydra:member']);
        });
    },
    [userId],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleDateTimeChange = (field, date) => {
    setUserData({ ...userData, [field]: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setState({ submitted: true });
    const { username, password } = state;
    const { dispatch } = props;
    if (username && password) {
      dispatch(userActions.login(username, password));
    }
  };

  const closeDialogHandler = () => onClose(false);
  const saveDialogHandler = () => onClose(true);

  return (
    <div className={classes.main}>
      <Dialog open={open} onClose={closeDialogHandler} aria-labelledby="form-dialog-title" maxWidth="xs" fullWidth>
        <DialogTitle id="form-dialog-title">Edycja użytkownika</DialogTitle>
        <DialogContent>
          <FormControl component="div" className={classes.formControl}>
            <InputLabel htmlFor="default-work-schedule-profile">Domyślny profil harmonogramu</InputLabel>
            <Select
              value={userData.defaultWorkScheduleProfile}
              onChange={handleChange}
              inputProps={{
                name: 'defaultWorkScheduleProfile',
                id: 'default-work-schedule-profile',
              }}
            >
              {workScheduleProfiles.map(workScheduleProfile => (
                <MenuItem componet="li" button key={workScheduleProfile.name} value={workScheduleProfile.id}>
                  {workScheduleProfile.name}
                </MenuItem>
              ))}
            </Select>
            <KeyboardTimePicker
              label="Rozpoczęcie pracy od"
              margin="normal"
              id="dayStartTimeFrom"
              ampm={false}
              cancelLabel="Anuluj"
              okLabel="Ustaw"
              invalidDateMessage="Nieprawidłowy format czasu"
              value={userData.dayStartTimeFrom}
              onChange={date => handleDateTimeChange('dayStartTimeFrom', date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardTimePicker
              label="Rozpoczęcie pracy do"
              margin="normal"
              id="dayStartTimeTo"
              ampm={false}
              cancelLabel="Anuluj"
              okLabel="Ustaw"
              invalidDateMessage="Nieprawidłowy format czasu"
              value={userData.dayStartTimeTo}
              onChange={date => handleDateTimeChange('dayStartTimeTo', date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardTimePicker
              label="Rozpoczęcie pracy od"
              margin="normal"
              id="dayEndTimeFrom"
              ampm={false}
              cancelLabel="Anuluj"
              okLabel="Ustaw"
              invalidDateMessage="Nieprawidłowy format czasu"
              value={userData.dayEndTimeFrom}
              onChange={date => handleDateTimeChange('dayEndTimeFrom', date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
            <KeyboardTimePicker
              label="Rozpoczęcie pracy do"
              margin="normal"
              id="dayEndTimeTo"
              ampm={false}
              cancelLabel="Anuluj"
              okLabel="Ustaw"
              invalidDateMessage="Nieprawidłowy format czasu"
              value={userData.dayEndTimeTo}
              onChange={date => handleDateTimeChange('dayEndTimeTo', date)}
              KeyboardButtonProps={{
                'aria-label': 'change time',
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogHandler} color="primary">
            Anuluj
          </Button>
          <Button onClick={saveDialogHandler} color="primary">
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
  dispatch: PropTypes.func.isRequired,
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
