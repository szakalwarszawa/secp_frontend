import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './alert.actions';
import { history } from '../_helpers';

function getOwnData() {
  function request() {
    return { type: userConstants.GET_OWN_DATA_REQUEST };
  }

  function success(user) {
    return { type: userConstants.GET_OWN_DATA_SUCCESS, user };
  }

  function failure(error) {
    return { type: userConstants.GET_OWN_DATA_FAILURE, error };
  }

  return (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(request());

    userService.getOwnUserData()
      .then(
        (user) => {
          dispatch(success(user));
        },
        (error) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        },
      );
  };
}

function login(username, password) {
  function request() {
    return { type: userConstants.LOGIN_REQUEST };
  }

  function success(token) {
    return { type: userConstants.LOGIN_SUCCESS, token };
  }

  function failure(error) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }

  return (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(request({ username }));

    userService.login(username, password)
      .then(
        (token) => {
          dispatch(success(token));
          dispatch(this.getOwnData());
          history.push('/');
        },
        (error) => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        },
      );
  };
}

function logout() {
  userService.logout();
  return { type: userConstants.LOGOUT };
}

export const userActions = {
  login,
  logout,
  getOwnData,
};
