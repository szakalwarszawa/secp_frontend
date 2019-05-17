import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// import { userActions } from '../_actions';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Fake user',
    };
  }

  render() {
    const { username } = this.state;

    return (
      <div className="col-md-6 col-md-offset-3">
        <h1>
          Hi
          {` ${username} `}
          !
        </h1>
        <p>You&apos;re logged in with React!!</p>
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
    users,
  };
}

const connectedHomePage = connect(mapStateToProps)(Home);
export { connectedHomePage as Home };
