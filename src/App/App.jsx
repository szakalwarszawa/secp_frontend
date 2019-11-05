import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './App.css';
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import DateFnsUtils from '@date-io/date-fns';
import DateFnsUtilsLocalePl from 'date-fns/locale/pl';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';


import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { Fab, Tooltip } from '@material-ui/core';
import { alertActions, userActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { history } from '../_helpers';
import { Login } from '../Pages/Login';
import { Home } from '../Pages/Home';
import { TimesheetList, TimesheetListToAccept } from '../Pages/Timesheet';
import { WorkScheduleList } from '../Pages/WorkSchedule';
import { UserList } from '../Pages/User';
import AppHeader from '../_components/AppHeader';
import { UserCalendar } from '../Pages/Calendar';
import { userService } from '../_services';
import { EditUserTimesheetDay } from '../Dialogs/UserTimesheetDay';
import { IssueReportDialog } from '../Dialogs/App';

class App extends React.Component {
  handlCloseSnackBar = () => {
    const { dispatch } = this.props;
    dispatch(alertActions.clear());
  };

  constructor(props) {
    super(props);
    this.state = {
      openIssueReportDialog: false,
    };
  }

  render() {
    const { alert, classes, loggedIn } = this.props;
    const { openIssueReportDialog } = this.state;
    console.info(`UI_TAG: ${process.env.REACT_APP_GIT_TAG}`);
    console.info(`UI_GIT: ${process.env.REACT_APP_GIT_COMMIT}`);
    console.info(`UI_DATE: ${process.env.REACT_APP_DEPLOY_TIME}`);

    const handleDialogOpen = () => {
      this.setState({ openIssueReportDialog: !openIssueReportDialog });
    };

    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={DateFnsUtilsLocalePl}>
          <Router history={history}>
            {loggedIn ? <AppHeader appBarTitle="Ewidencja Czasu Pracy" /> : null}
            <Grid
              container
              className={classes.root}
              alignItems="center"
              spacing={4}
              style={{ margin: '5px', marginTop: '70px' }}
            >
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/userCalendar" component={UserCalendar} accessRight />
              <PrivateRoute path="/timesheetList" component={TimesheetList} accessRight />
              <PrivateRoute
                path="/userWorkSchedules"
                component={WorkScheduleList}
                accessRight={userService.isManager()}
              />
              <PrivateRoute
                path="/timesheetListToAccept"
                component={TimesheetListToAccept}
                accessRight
              />
              <PrivateRoute
                path="/users"
                component={UserList}
                accessRight={userService.isHR()}
              />
              <Snackbar
                open={alert.message && alert.message !== ''}
                autoHideDuration={4000}
                className={classes.snackBarInfo}
              >
                <SnackbarContent
                  className={classes.snackBarInfo}
                  message={(
                    <span className={classes.message}>
                      <InfoIcon className={classes.icon} />
                      {alert.message}
                    </span>
                  )}
                  action={(
                    <IconButton
                      key="close"
                      aria-label="Close"
                      color="inherit"
                      className={classes.close}
                      onClick={this.handlCloseSnackBar}
                    >
                      <CloseIcon className={classes.icon} />
                    </IconButton>
                  )}
                />
              </Snackbar>
            </Grid>
          </Router>
        </MuiPickersUtilsProvider>
        <Tooltip title="Zgłoś błąd">
          <Fab
            size="small"
            color="secondary"
            aria-label="issue"
            className={classes.issueFab}
            onClick={handleDialogOpen}
            onClose={handleDialogOpen}
          >
            <ReportProblemIcon />
          </Fab>
        </Tooltip>
        {openIssueReportDialog && (
        <IssueReportDialog
          open={this.state.openIssueReportDialog}
          onClose={handleDialogOpen}
          reporter={userService.getUserData()}
        />
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(),
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  snackBarInfo: {
    backgroundColor: theme.palette.primary.dark,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  issueFab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
});

App.propTypes = {
  alert: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.instanceOf(Object),
  loggedIn: PropTypes.bool,
};

App.defaultProps = {
  classes: {},
  loggedIn: false,
};

const mapStateToProps = (state) => {
  const { loggedIn } = state.authentication;
  const { alert } = state;
  return {
    alert,
    loggedIn,
  };
};

const connectedApp = connect(mapStateToProps)(
  withStyles(styles)(App),
);
export { connectedApp as App };
