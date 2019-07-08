import { userConstants } from '../_constants';

const token = JSON.parse(sessionStorage.getItem('token'));
const user = JSON.parse(sessionStorage.getItem('user'));

const initialState = token ? {
  loggingIn: false,
  requestInProgress: false,
  loggedIn: true,
  token,
  user,
} : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        loggedIn: false,
        token: null,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        token: action.token,
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
        loggedIn: false,
        token: null,
      };
    case userConstants.GET_OWN_DATA_REQUEST:
      return {
        ...state,
        requestInProgress: true,
        user: {},
      };
    case userConstants.GET_OWN_DATA_SUCCESS:
      return {
        ...state,
        requestInProgress: false,
        user: action.user,
      };
    case userConstants.GET_OWN_DATA_FAILURE:
      return {
        ...state,
        requestInProgress: false,
        user: {},
      };
    case userConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}
