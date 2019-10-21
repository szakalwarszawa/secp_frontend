import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { AppBar, Box, Grid, IconButton, Tab, Tabs, Typography, Dialog } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { EditUserTimesheetForm } from './EditUserTimesheetForm';
import { ConfirmDialog } from '../Common';
import { apiService } from '../../_services';
import { LogsTable } from '../../_components';

function EditUserTimesheetComp(props) {
  const {
    classes,
    open,
    userTimesheetId,
    onClose,
  } = props;

  const [state, setState] = useState({
    loaded: false,
    loaderWorkerCount: 0,
    requestError: null,
    tabIndex: 0,
  });
  const [userTimesheetData, setUserTimesheetData] = useState({
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

  useEffect(
    () => {
      setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get(`user_timesheets/${userTimesheetId}`)
        .then((result) => {
          setUserTimesheetData(s => ({
            ...s,
            ...result,
          }));
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          setState(s => ({ ...s, loaded: true }));
        });
    },
    [userTimesheetId],
  );

  const closeDialogHandler = () => onClose(false);

  const saveDialogHandler = (savedData) => {
    const payload = {
      status: `/api/user_timesheet_statuses/${savedData.status.id}`,
    };

    setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1, loaded: false }));
    apiService.put(`user_timesheets/${userTimesheetId}`, payload)
      .then(
        (result) => {
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          setState(s => ({ ...s, loaded: false }));
          onClose(true, result);
        },
        (error) => {
          setState(s => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          setState(s => ({ ...s, requestError: error }));
        },
      );
  };

  const handleTabChange = (event, newValue) => {
    setState(s => ({ ...s, tabIndex: newValue }));
  };

  function TabPanel(propsTabPanel) {
    const { children, value, index, ...other } = propsTabPanel;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`timesheet-tabpanel-${index}`}
        aria-labelledby={`timesheet-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  TabPanel.defaultProps = {
    children: (<></>),
  };

  function applyProps(index) {
    return {
      id: `timesheet-tab-${index}`,
      'aria-controls': `timesheet-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
        <AppBar position="static">
          <Grid container>
            <Grid item xs={11}>
              <Tabs value={state.tabIndex} onChange={handleTabChange}>
                <Tab label="Edycja listy" {...applyProps(0)} />
                <Tab label="Rejestr zmian" {...applyProps(1)} />
              </Tabs>
            </Grid>
            <Grid item xs={1} className={classes.centerFlex}>
              <IconButton onClick={onClose}>
                <CloseIcon className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
        <TabPanel value={state.tabIndex} index={0}>
          {state.loaded && (
            <EditUserTimesheetForm
              userTimesheet={userTimesheetData}
              open={open}
              onClose={closeDialogHandler}
              onSave={saveDialogHandler}
              classes={classes}
              requestError={state.requestError}
            />
          )}
        </TabPanel>
        <TabPanel value={state.tabIndex} index={1}>
          {state.loaded && (
            <LogsTable route="user_timesheets" value={userTimesheetData.id} />
          )}
        </TabPanel>
      </Dialog>
    </>
  );
}

EditUserTimesheetComp.propTypes = {
  open: PropTypes.bool.isRequired,
  userTimesheetId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
};

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

EditUserTimesheetComp.defaultProps = {
  classes: {},
};

const mapStateToProps = state => ({ ...state });

const styledEditUserTimesheet = withStyles(styles)(EditUserTimesheetComp);
const connectedEditUserTimesheet = connect(mapStateToProps)(styledEditUserTimesheet);
export { connectedEditUserTimesheet as EditUserTimesheet };
