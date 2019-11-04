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
import FormHelperText from '@material-ui/core/FormHelperText';
import { alertConstants } from '../../_constants';
import { apiService } from '../../_services';

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
    lockForm: false,
    submitted: false,
  });
  const isLoading = Boolean(state.loaderWorkerCount > 0);
  const [issueData, setIssueData] = useState({
    reporterName: reporter ? reporter.fullName : '',
    subject: '',
    description: '',
  });

  const handleInputChange = (field, value) => {
    setIssueData({ ...issueData, [field]: value });
  };

  const validateForm = () => {
    if (!issueData.description) {
      return false;
    }
    if (!issueData.reporterName) {
      return false;
    }
    if (!issueData.subject) {
      return false;
    }

    return true;
  };

  const saveDialogHandler = () => {
    setState((s) => ({ ...s, submitted: true }));
    if (!validateForm()) {
      return;
    }

    setState((s) => ({ ...s, loaderWorkerCount: s.loaderWorkerCount + 1 }));
    apiService.post('app_issues', issueData)
      .then(
        (data) => {
          setState({ ...state, loaderWorkerCount: state.loaderWorkerCount - 1 });
          let responseData;
          if (!data.redmineTaskId) {
            responseData = {
              message: 'Nie udało się przesłać zgłoszenia. Skontaktuj się z administratorem.',
              type: alertConstants.ERROR,
            };
          } else {
            responseData = {
              message: `Zgłoszenie zostało wysłane poprawnie, otrzymało numer: #${data.redmineTaskId}`,
              type: alertConstants.SUCCESS,
            };
          }

          setState({
            ...state,
            responseData,
            lockForm: true,
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
            lockForm: false,
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
            id="reporterName"
            label="Imię i nazwisko"
            type="text"
            fullWidth
            inputProps={{ maxLength: 70 }}
            disabled={!!reporter || isLoading || state.lockForm}
            defaultValue={reporter ? reporter.fullName : ''}
            onChange={(event) => handleInputChange(event.target.id, event.target.value)}
          />
          {state.submitted && !issueData.reporterName && (
          <FormHelperText error>
                Podanie swoich danych jest wymagane
          </FormHelperText>
          )}
          <TextField
            margin="dense"
            id="subject"
            label="Temat zgłoszenia"
            type="text"
            fullWidth
            inputProps={{ maxLength: 255 }}
            disabled={isLoading || state.lockForm}
            onChange={(event) => handleInputChange(event.target.id, event.target.value)}
          />
          {state.submitted && !issueData.subject && (
          <FormHelperText error>
                Podanie tematu zgłoszenia jest wymagane
          </FormHelperText>
          )}
          <TextField
            margin="dense"
            id="description"
            label="Opis zgłoszenia"
            type="text"
            fullWidth
            rows={5}
            multiline
            inputProps={{ maxLength: 5000 }}
            disabled={isLoading || state.lockForm}
            onChange={(event) => handleInputChange(event.target.id, event.target.value)}
          />
          {state.submitted && !issueData.description && (
          <FormHelperText error>
                Podanie opisu zgłoszenia jest wymagane
          </FormHelperText>
          )}
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
            disabled={isLoading || state.lockForm}
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
  reporter: PropTypes.instanceOf(Object),
  classes: PropTypes.instanceOf(Object),
};

IssueReportDialog.defaultProps = {
  classes: {},
  reporter: {},
};

const styledLoginPage = withStyles(styles)(IssueReportDialog);
export { styledLoginPage as IssueReportDialog };
