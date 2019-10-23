import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

function ConfirmDialog(props) {
  const {
    open,
    onClose,
    dialogTitle,
    children,
    acceptLabel,
    declineLabel,
  } = props;

  const handleAccept = () => onClose(true);
  const handleDecline = () => onClose(false);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDecline}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDecline} color="primary">{declineLabel}</Button>
          <Button onClick={handleAccept} color="primary" autoFocus>{acceptLabel}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string,
  children: PropTypes.string.isRequired,
  acceptLabel: PropTypes.string,
  declineLabel: PropTypes.string,
};

ConfirmDialog.defaultProps = {
  dialogTitle: 'Potwierdź',
  acceptLabel: 'Tak',
  declineLabel: 'Nie',
};

export { ConfirmDialog };
