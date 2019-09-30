import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TableChartIcon from '@material-ui/icons/TableChart';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import IconAccountCircle from '@material-ui/icons/AccountCircle';
import IconAccessTime from '@material-ui/icons/AccessTime';
import IconDoneAll from '@material-ui/icons/DoneAll';
import IconList from '@material-ui/icons/List';
import IconPeople from '@material-ui/icons/People';
// import Badge from '@material-ui/core/Badge';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const useStyles = makeStyles(theme => ({
  menuButton: {
    // marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    // width: 250,
  },
  fullList: {
    // width: 'auto',
  },
  userLoaded: {
    display: 'flex',
  },
  userNotLoaded: {
    display: 'none',
  },
}));

function AppHeader(props) {
  const classes = useStyles();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { appBarTitle, user } = props;

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="user-account-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem component="span" button={false}>
        {`${user.lastName} ${user.firstName}`}
      </MenuItem>
      <Divider component="hr" />
      {/*<MenuItem component="li" button onClick={handleProfileMenuClose}>Profil</MenuItem>*/}
      {/*<MenuItem component="li" button onClick={handleProfileMenuClose}>Moje konto</MenuItem>*/}
      <Divider component="hr" />
      <MenuItem
        component="a"
        button
        href="/login/"
      >
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
          aria-haspopup="true"
          onClick={() => setDrawerOpened(true)}
          href={null}
        >
          <MenuIcon />
        </IconButton>
        <Drawer open={drawerOpened} onClose={() => setDrawerOpened(false)}>
          <List component="ul">
            <ListItem button component="a" href="/userCalendar/">
              <ListItemIcon><IconAccessTime /></ListItemIcon>
              <ListItemText primary="Kalendarz" />
            </ListItem>
            <ListItem button component="a" href="/timesheetList/">
              <ListItemIcon><IconList /></ListItemIcon>
              <ListItemText primary="Lista obecności" />
            </ListItem>
            <ListItem button component="a" href="/userWorkSchedules/">
              <ListItemIcon><TableChartIcon /></ListItemIcon>
              <ListItemText primary="Lista harmonogramów" />
            </ListItem>
            <ListItem button component="a" href="/timesheetListToAccept/">
              <ListItemIcon><IconDoneAll /></ListItemIcon>
              <ListItemText primary="Lista obecności do akceptacji" />
            </ListItem>
            <Divider component="hr" />
            <ListItem button component="a" href="/users/">
              <ListItemIcon><IconPeople /></ListItemIcon>
              <ListItemText primary="Lista użytkowników" />
            </ListItem>
          </List>
        </Drawer>
        <Typography variant="h6" className={classes.title}>
          {appBarTitle}
        </Typography>
        <div className={user.username !== undefined ? classes.userLoaded : classes.userNotLoaded}>
          {/*<IconButton aria-label="Pokaz wszystkie przypomnienia" color="inherit">*/}
          {/*  <Badge badgeContent={3} color="secondary">*/}
          {/*    <NotificationsIcon />*/}
          {/*  </Badge>*/}
          {/*</IconButton>*/}
          <IconButton
            edge="end"
            aria-label="Moje konto"
            aria-haspopup="true"
            aria-controls="user-account-menu"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <IconAccountCircle />
          </IconButton>
        </div>
      </Toolbar>
      {renderUserMenu}
    </AppBar>
  );
}

AppHeader.propTypes = {
  appBarTitle: PropTypes.string,
  user: PropTypes.instanceOf(Object),
};

AppHeader.defaultProps = {
  appBarTitle: 'Home',
  user: {},
};

const mapStateToProps = (state) => {
  const { user } = state.authentication;
  return {
    user,
  };
};

export default connect(mapStateToProps)(AppHeader);
