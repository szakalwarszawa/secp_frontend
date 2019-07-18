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


import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { history } from '../_helpers';
import { Login } from '../Pages/Login';
import { Home } from '../Pages/Home';
import { TimesheetList } from '../Pages/Timesheet';
import { UserList } from '../Pages/User';
import AppHeader from '../_components/AppHeader';
import { UserCalendar } from '../Pages/Calendar';

class App extends React.Component {
  handlCloseSnackBar = () => {
    const { dispatch } = this.props;
    dispatch(alertActions.clear());
  };

  render() {
    const { alert, classes, loggedIn } = this.props;

    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={DateFnsUtilsLocalePl}>
          <Router history={history}>
            {loggedIn ? <AppHeader appBarTitle="SECP" /> : null}
            <Grid
              container
              className={classes.root}
              alignItems="center"
              spacing={4}
              style={{ margin: '5px', marginTop: '70px' }}
            >
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/userCalendar" component={UserCalendar} />
              <PrivateRoute path="/timesheetList" component={TimesheetList} />
              <PrivateRoute path="/timesheetListToAccept" component={Home} />
              <PrivateRoute path="/users" component={UserList} />
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
      </div>
    );
  }
}

const styles = theme => ({
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
};

function mapStateToProps(state) {
  const { loggedIn } = state.authentication;
  const { alert } = state;
  return {
    alert,
    loggedIn,
  };
}

const connectedApp = connect(mapStateToProps)(
  withStyles(styles)(App),
);
export { connectedApp as App };
