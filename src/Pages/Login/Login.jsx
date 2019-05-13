import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// import { userActions } from '../_actions';

class Login extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        // this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            // dispatch(userActions.login(username, password));
        }
    };

    render() {
        const { loggingIn } = this.props;
        const { classes } = this.props;
        const { username, password, submitted } = this.state;
        return (
            <div>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography variant="title" color="inherit">
                            Login
                        </Typography>
                        <form name="form" onSubmit={this.handleSubmit}>
                            <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                                <label htmlFor="username">Username</label>
                                <input type="text" className="form-control" name="username" value={username}
                                       onChange={this.handleChange}/>
                                {submitted && !username &&
                                <div className="help-block">Username is required</div>
                                }
                            </div>
                            <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" name="password" value={password}
                                       onChange={this.handleChange}/>
                                {submitted && !password &&
                                <div className="help-block">Password is required</div>
                                }
                            </div>
                            <CardActions className="form-group">
                                <Button size="medium">Login</Button>
                            </CardActions>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

const styles = {
    card: {
        minWidth: 275
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)'
    },
    title: {
        fontSize: 14
    },
    pos: {
        marginBottom: 12
    }
};

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(withStyles(styles)(Login));
export {connectedLoginPage as Login};
