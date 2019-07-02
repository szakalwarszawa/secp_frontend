import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import IconAccountClock from '@material-ui/icons/AccountCircle';
import IconAlarmCheck from '@material-ui/icons/Alarm';
import IconCheck from '@material-ui/icons/Check';
import { withStyles } from '@material-ui/core';

class Home extends React.Component {
  state = {
    drawerOpen: false,
  };

  openDrawer = () => {
    this.setState({ drawerOpen: true });
  };

  closeDrawer = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    const { user, classes, appBarTitle } = this.props;
    const { anchorEl, drawerOpen } = this.state;

    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.openDrawer}
              href={null}
            >
              <MenuIcon />
            </IconButton>
            <Drawer open={drawerOpen} onClose={this.closeDrawer}>
              <List>
                <ListItem button component="Link" href="/addTimesheetDayReport/">
                  <ListItemIcon><IconAlarmCheck /></ListItemIcon>
                  <ListItemText primary="Wprowadź obecność" />
                </ListItem>
                <ListItem button component="Link" href="/timesheetList/">
                  <ListItemIcon><IconAccountClock /></ListItemIcon>
                  <ListItemText primary="Lista obecności" />
                </ListItem>
                <ListItem button component="Link" href="/timesheetListToAccept/">
                  <ListItemIcon><IconCheck /></ListItemIcon>
                  <ListItemText primary="Lista obecności do akceptacji" />
                </ListItem>
                <Divider />
                <ListItem button component="Link" href="/users/">
                  <ListItemText primary="Lista użytkowników" />
                </ListItem>
              </List>
            </Drawer>
            <Typography variant="h6" className={classes.title}>
              {appBarTitle}
            </Typography>
            <Button color="inherit" variant="text" href="/login/">Logout</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
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
