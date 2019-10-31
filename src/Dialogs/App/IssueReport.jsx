import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { alertConstants } from '../../_constants';
import { apiService, userService } from '../../_services';

function IssueReportDialog(props) {
  const {
    open,
    onClose,
    reporter,
    classes,
  } = props;

  const [state, setState] = useState({
    loaderWorkerCount: 0,
    responseData: {
      type: null,
      message: '',
    },
  });

  const isLoading = Boolean(state.loaderWorkerCount > 0);

  const [issueData, setIssueData] = useState({
    reporterName: reporter.fullName,
    subject: '',
    description: '',
  });

  const handleInputChange = (field, value) => {
    setIssueData({ ...issueData, [field]: value });
    console.log(issueData);
  };

  const saveDialogHandler = () => {
    setState((s) => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1, requestError: null }));
    apiService.post('app_issues', issueData)
      .then(
        (data) => {
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
          const responseData = {
            message: `Zgłoszenie zostało wysłane poprawnie, otrzymało numer: #${data.redmineTaskId}`,
            type: alertConstants.SUCCESS,
          };
          setState({
            ...state,
            responseData,
          });
        },
        (error) => {
          const responseData = {
            message: error,
            type: alertConstants.ERROR,
          };
          setState({
            ...state,
            responseData,
          });
        },
      );
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          Zgłoś błąd aplikacji
          <IconButton className={classes.closeButton} aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
              Jeżeli w aplikacji wystąpił błąd możesz to zgłosić za pomocą tego formularza.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reporter"
            label="Imię i nazwisko"
            type="text"
            fullWidth
            inputProps={{ maxLength: 70 }}
            disabled={(reporter) || isLoading || state.responseData.type === alertConstants.SUCCESS}
            value={reporter ? reporter.fullName : ''}
            onChange={(event) => handleInputChange(event.target.id, event.target.value)}
          />
          <TextField
            margin="dense"
            id="subject"
            label="Temat zgłoszenia"
            type="text"
            fullWidth
            inputProps={{ maxLength: 255 }}
            disabled={isLoading || state.responseData.type === alertConstants.SUCCESS}
            onChange={(event) => handleInputChange(event.target.id, event.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Opis zgłoszenia"
            type="text"
            fullWidth
            rows={5}
            multiline
            inputProps={{ maxLength: 5000 }}
            disabled={isLoading || state.responseData.type === alertConstants.SUCCESS}
            onChange={(event) => handleInputChange(event.target.id, event.target.value)}
          />
          <Paper
            hidden={state.responseData.type === null}
            className={state.responseData.type === alertConstants.SUCCESS ? classes.successBox : classes.errorBox}
            elevation={5}
          >
            {state.responseData.message}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button href="" disabled={isLoading} onClick={onClose} color="primary">
                  Anuluj
          </Button>
          <Button
            href=""
            disabled={isLoading || state.responseData.type === 'success'}
            onClick={saveDialogHandler}
            color="primary"
          >
                  Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const styles = (theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  errorBox: {
    padding: theme.spacing(),
    marginTop: theme.spacing(),
    background: theme.palette.error.main,
  },
  successBox: {
    padding: theme.spacing(),
    marginTop: theme.spacing(),
    background: '#8bc34a',
  },
});

IssueReportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reporter: PropTypes.object.isRequired,
};

const styledLoginPage = withStyles(styles)(IssueReportDialog);
export { styledLoginPage as IssueReportDialog };
