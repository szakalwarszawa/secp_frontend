import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

function ContentDialog(props) {
  const {
    open,
    onAccept,
    dataOnAccept,
    onDecline,
    dataOnDecline,
    dialogTitle,
    children,
    acceptLabel,
    declineLabel,
  } = props;

  const handleAccept = () => onAccept(dataOnAccept);
  const handleDecline = () => onDecline(dataOnDecline);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDecline}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
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

ContentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  dataOnAccept: PropTypes.oneOfType(['bool', 'string', 'object']),
  dataOnDecline: PropTypes.oneOfType(['bool', 'string', 'object']),
  dialogTitle: PropTypes.string,
  children: PropTypes.string.isRequired,
  acceptLabel: PropTypes.string,
  declineLabel: PropTypes.string,
};

ContentDialog.defaultProps = {
  dataOnAccept: true,
  dataOnDecline: false,
  dialogTitle: 'ECP',
  acceptLabel: 'Tak',
  declineLabel: 'Nie',
};

export { ContentDialog };
