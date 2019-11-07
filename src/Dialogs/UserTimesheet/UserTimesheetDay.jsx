import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

import { UserTimesheetDayTable } from './UserTimesheetDayTable';

const useStyles = makeStyles(() => ({
  mainTable: {
    width: '100%',
    marginRight: '45px',
  },
  centerFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function UserTimesheetDayComp(props) {
  const {
    open,
    userTimesheetId,
    onClose,
  } = props;

  const classes = useStyles();

  const handleClose = () => onClose();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <AppBar position="static">
          <Grid container>
            <Grid item lg={11}>
              <DialogTitle id="alert-dialog-title">Lista obecności</DialogTitle>
            </Grid>
            <Grid item lg={1} className={classes.centerFlex}>
              <IconButton onClick={handleClose}>
                <CloseIcon className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
        <DialogContent>
          <UserTimesheetDayTable
            userTimesheetId={userTimesheetId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Zamknij</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

UserTimesheetDayComp.propTypes = {
  open: PropTypes.bool.isRequired,
  userTimesheetId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ ...state });

const connectedUserTimesheetDay = connect(mapStateToProps)(UserTimesheetDayComp);
export { connectedUserTimesheetDay as UserTimesheetDay };
