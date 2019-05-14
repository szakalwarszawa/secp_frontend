import React from 'react';
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {history} from '../_helpers';
import './App.css';
import {PrivateRoute} from '../_components';
import {Home} from '../Pages/Home';
import {Login} from '../Pages/Login';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class App extends React.Component {
    render() {
        // const { alert } = this.props;
        const { classes } = this.props;
        return (
            <Grid container className={classes.root} alignItems="center" spacing={8}>
                <Grid item xs={12}>
                    <Grid container className={classes.demo} justify="center">
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={Home}/>
                                <Route path="/login" component={Login} />
                                {/*<Route path="/register" component={RegisterPage} />*/}
                            </div>
                        </Router>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
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
});

const connectedApp = connect(mapStateToProps)(withStyles(styles)(App));
export {connectedApp as App};
