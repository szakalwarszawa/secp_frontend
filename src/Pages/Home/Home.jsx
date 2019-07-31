import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

class Home extends React.Component {
  render() {
    return (
      <div>:)</div>
    );
  }
}

const styles = theme => ({
});

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users,
  };
}

const styledHomePage = withStyles(styles)(Home);
const connectedHomePage = connect(mapStateToProps)(styledHomePage);
export { connectedHomePage as Home };
