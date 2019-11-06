import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

function ContentDialog(props) {
  const {
    open,
    onAccept,
    onDecline,
    dialogTitle,
    children,
    acceptLabel,
    declineLabel,
  } = props;

  const handleAccept = () => onAccept();
  const handleDecline = () => onDecline();

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDecline}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContent id="alert-dialog-description">{children}</DialogContent>
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
  dialogTitle: PropTypes.string,
  children: PropTypes.element.isRequired,
  acceptLabel: PropTypes.string,
  declineLabel: PropTypes.string,
};

ContentDialog.defaultProps = {
  dialogTitle: 'ECP',
  acceptLabel: 'Tak',
  declineLabel: 'Nie',
};

export { ContentDialog };
