import React from 'react';
import {connect} from 'react-redux';
import { userActions } from '../../_actions';

import {withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

// import { userActions } from '../_actions';

class Login extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

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
            dispatch(userActions.login(username, password));
        }
    };

    render() {
        const { loggingIn } = this.props;
        const { classes } = this.props;
        const { username, password, submitted } = this.state;
        return (
            <div className={classes.main}>
                <CssBaseline/>
                <Paper className={classes.paper} elevation={8}>
                    <Typography component="h1" variant="h5">
                        SECP Login
                    </Typography>
                    <form className={classes.form} noValidate name="form" onSubmit={this.handleSubmit}>
                        <FormControl margin="normal" required fullWidth>
                            <TextField
                                className={classes.textField}
                                value={username}
                                name={'username'}
                                label="Login"
                                margin="normal"
                                variant="standard"
                                onChange={this.handleChange}
                                error={submitted && !username}
                                helperText={submitted && !username &&
                                <FormHelperText error={true}>Podanie loginu jest
                                    wymagne</FormHelperText>
                                }
                                autoFocus
                            />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <TextField
                                className={classes.textField}
                                value={password}
                                name={'password'}
                                label="Hasło"
                                margin="normal"
                                variant="standard"
                                type="password"
                                onChange={this.handleChange}
                                error={submitted && !password}
                                helperText={submitted && !password &&
                                <FormHelperText error={true}>Podanie hasła jest
                                    wymagne</FormHelperText>
                                }
                            />
                        </FormControl>
                        <Button
                            className={classes.submit}
                            color={'primary'}
                            type={'submit'}
                            fullWidth
                            // disabled={submitted}
                        >Login</Button>
                    </form>
                </Paper>
            </div>
        );
    }
}

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    }
});

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(
    withStyles(styles)(Login)
);
export {connectedLoginPage as Login};
