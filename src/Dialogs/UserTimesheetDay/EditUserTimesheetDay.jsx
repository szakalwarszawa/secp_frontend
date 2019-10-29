import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { AppBar, Box, Grid, IconButton, Tab, Tabs, Typography, Dialog } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { EditUserTimesheetDayForm } from './EditUserTimesheetDayForm';
import { apiService } from '../../_services';
import { LogsTable } from '../../_components';

function EditUserTimesheetDayComp(props) {
  const {
    classes,
    open,
    userTimesheetDayId,
    onClose,
  } = props;

  const [state, setState] = useState({
    loaded: false,
    loaderWorkerCount: 0,
    requestError: null,
    tabIndex: 0,
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

  useEffect(
    () => {
      setState((s) => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
      apiService.get(`user_timesheet_days/${userTimesheetDayId}`)
        .then((result) => {
          const dayStartTimeDate = result.dayStartTime !== null
            ? new Date(`${result.userWorkScheduleDay.dayDefinition.id}T${result.dayStartTime}:00`)
            : null;
          const dayEndTimeDate = result.dayEndTime !== null
            ? new Date(`${result.userWorkScheduleDay.dayDefinition.id}T${result.dayEndTime}:00`)
            : null;

          setUserTimesheetDayData((s) => ({
            ...s,
            ...result,
            presenceTypeId: result.presenceType !== null ? result.presenceType.id : null,
            absenceTypeId: ('absenceType' in result) && result.absenceType !== null ? result.absenceType.id : null,
            dayStartTime: dayStartTimeDate,
            dayEndTime: dayEndTimeDate,
            timesheetDayDate: moment(result.userWorkScheduleDay.dayDefinition.id).format('YYYY-MM-DD'),
          }));
          setState((s) => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          setState((s) => ({ ...s, loaded: true }));
        });
    },
    [userTimesheetDayId],
  );

  const closeDialogHandler = () => onClose(false);

  const saveDialogHandler = (savedData) => {
    setState((s) => ({ ...s, loaded: false }));
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
        : '0.00',
    };

    setState((s) => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
    apiService.put(`user_timesheet_days/${userTimesheetDayId}`, payload)
      .then(
        (result) => {
          setState((s) => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          onClose(true, result);
        },
        (error) => {
          setState((s) => ({ ...s, loaderWorkerCount: s.loaderWorkerCount - 1 }));
          setState((s) => ({ ...s, requestError: error }));
        },
      );
  };

  const handleTabChange = (event, newValue) => {
    setState((s) => ({ ...s, tabIndex: newValue }));
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
                <Tab label="Edycja dnia pracy" {...applyProps(0)} />
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
            <EditUserTimesheetDayForm
              userTimesheetDay={userTimesheetDayData}
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
            <LogsTable route="user_timesheet_days" value={userTimesheetDayData.id} />
          )}
        </TabPanel>
      </Dialog>
    </>
  );
}

EditUserTimesheetDayComp.propTypes = {
  open: PropTypes.bool.isRequired,
  userTimesheetDayId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
};

const styles = (theme) => ({
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

EditUserTimesheetDayComp.defaultProps = {
  classes: {},
};

const mapStateToProps = () => ({});

const styledEditUserTimesheetDay = withStyles(styles)(EditUserTimesheetDayComp);
const connectedEditUserTimesheetDay = connect(mapStateToProps)(styledEditUserTimesheetDay);
export { connectedEditUserTimesheetDay as EditUserTimesheetDay };
