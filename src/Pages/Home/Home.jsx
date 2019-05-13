import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// import { userActions } from '../_actions';

class Home extends React.Component {
    componentDidMount() {
        // this.props.dispatch(userActions.getAll());
    }

    handleDeleteUser(id) {
        // return (e) => this.props.dispatch(userActions.delete(id));
    }

    render() {
        const { user } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName}!</h1>
                <p>You're logged in with React!!</p>
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(Home);
export { connectedHomePage as Home };
