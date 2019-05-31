import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './App.css';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';

import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { history } from '../_helpers';
import { Login } from '../Pages/Login';
import { Home } from '../Pages/Home';

class App extends React.Component {
  handlCloseSnackBar = () => {
    const { dispatch } = this.props;
    dispatch(alertActions.clear());
  };

  render() {
    const { alert } = this.props;
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} alignItems="center" spacing={8}>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Router history={history}>
              <div>
                <PrivateRoute exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                {/* <Route path="/register" component={RegisterPage} /> */}
              </div>
            </Router>
          </Grid>
        </Grid>
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
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
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
};

App.defaultProps = {
  classes: {},
};

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert,
  };
}

const connectedApp = connect(mapStateToProps)(
  withStyles(styles)(App),
);
export { connectedApp as App };
