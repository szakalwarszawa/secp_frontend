import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Paper from '@material-ui/core/Paper';

import { apiService, userService } from '../../_services';
import { userConstants } from '../../_constants';
import { ConfirmDialog } from '../Common';

function EditUserTimesheetFormComp(props) {
  const {
    classes,
    userTimesheet,
    onSave,
    onClose,
    requestError,
  } = props;

  const [state, setState] = useState({
    loaderWorkerCount: 0,
    requestError: null,
    submitted: false,
    confirmOpen: false,
  });
  const [userTimesheetData, setUserTimesheetData] = useState({
    owner: {
      lastName: '',
      firstName: '',
    },
    period: '2000-01',
    status: {
      id: '',
    },
    statusId: -1,
  });
  const [statuses, setStatuses] = useState([]);
  const isLoading = Boolean(state.loaderWorkerCount > 0);

  /**
   * @param {Object} actualStatus
   * @param {string} actualStatus.id
   * @param {string} actualStatus.name
   * @param {string} actualStatus.rules
   * @return {(string[]|null)}
   */
  const getAllowedStatusChange = (actualStatus) => {
    if (!actualStatus || actualStatus.rules === '') {
      return null;
    }
    const rules = JSON.parse(actualStatus.rules);

    if (userService.isHR()) {
      return rules[userConstants.ROLES.ROLE_HR] || null;
    }

    if (userService.isManager()) {
      return rules[userConstants.ROLES.ROLE_DEPARTMENT_MANAGER] || null;
    }

    return rules[userConstants.ROLES.ROLE_USER] || null;
  };

  /**
   * @param {Object} actualStatus
   * @param {Object[]} allStatuses
   */
  const makeStatusList = (actualStatus, allStatuses) => {
    const allowedStatusChange = getAllowedStatusChange(actualStatus);
    if (allowedStatusChange === null) {
      return [actualStatus];
    }

    allowedStatusChange.push(actualStatus.id);
    return allStatuses.filter(status => allowedStatusChange.indexOf(status.id) !== -1);
  };

  useEffect(
    () => {
      const statusId = userTimesheet.status !== null
        ? userTimesheet.status.id
        : null;

      setUserTimesheetData(s => ({
        ...s,
        ...userTimesheet,
        statusId,
        originalStatusId: statusId,
      }));

      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get('user_timesheet_statuses')
        .then((result) => {
          setStatuses(makeStatusList(userTimesheet.status, result['hydra:member']));
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
        });
    },
    [userTimesheet]
  );

  useEffect(
    () => {
      setState(s => ({ ...s, requestError }));
    },
    [requestError],
  );

  const saveDialogHandler = () => {
    setState(s => ({ ...s, confirmOpen: true }));
  };

  const handleStatusChange = (field, chosenStatus) => {
    const activeStatus = statuses.filter(
      status => status.id === chosenStatus,
    );

    setUserTimesheetData({
      ...userTimesheetData,
      [field]: chosenStatus,
      status: activeStatus[0],
    });
  };

  const onConfirmHandler = (confirm) => {
    setState(s => ({ ...s, confirmOpen: false }));

    if (confirm) {
      setState(s => ({ ...s, submitted: true, isLoading: true }));
      onSave(userTimesheetData);
    }
  };

  const closeDialogHandler = () => onClose(false);

  return (
    <div>
      <DialogContent>
        <DialogContentText component="div">
          <div>
            {`${userTimesheetData.owner.lastName} ${userTimesheetData.owner.firstName}`}
          </div>
          <div>
            {
              userTimesheetData.owner.department
                ? userTimesheetData.owner.department.name
                : ''
            }
            {
              userTimesheetData.owner.section
                ? (` / ${userTimesheetData.owner.section.name}`)
                : ''
            }
          </div>
          <div>
            Okres:&nbsp;
            {userTimesheetData.period}
          </div>
        </DialogContentText>

        <FormControl component="div" className={classes.formControl} disabled={isLoading}>
          <InputLabel htmlFor="status">Status listy</InputLabel>
          <Select
            value={userTimesheetData.statusId || -1}
            onChange={event => handleStatusChange(event.target.name, event.target.value)}
            inputProps={{
              name: 'statusId',
              id: 'statusId',
            }}
          >
            {statuses.map(status => (
              <MenuItem button componet="li" key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
          {state.submitted && userTimesheetData.status <= 0 && (
            <FormHelperText error>
              Podanie statusu jest wymagane
            </FormHelperText>
          )}
        </FormControl>

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
        <Button
          href=""
          onClick={saveDialogHandler}
          color="primary"
          disabled={isLoading || userTimesheetData.statusId === userTimesheetData.originalStatusId}
        >
          Zapisz
        </Button>
      </DialogActions>
      <ConfirmDialog
        open={state.confirmOpen}
        onClose={onConfirmHandler}
        dialogTitle="Potwierdź zmianę statusu"
        acceptLabel="Zmień"
        declineLabel="Anuluj"
      >
        Po zmianie statusu jego dalsza zmiana nie będzie już możliwa, dalsze zmiany moga być przeprowadzone jedynie
        przez uprawnione osoby.
      </ConfirmDialog>
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
  centerFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

EditUserTimesheetFormComp.propTypes = {
  userTimesheet: PropTypes.instanceOf(Object).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
  requestError: PropTypes.string,
};

EditUserTimesheetFormComp.defaultProps = {
  classes: {},
  requestError: '',
};

const mapStateToProps = state => ({ ...state });

const styledEditUserTimesheetForm = withStyles(styles)(EditUserTimesheetFormComp);
const connectedEditUserTimesheetForm = connect(mapStateToProps)(styledEditUserTimesheetForm);
export { connectedEditUserTimesheetForm as EditUserTimesheetForm };
