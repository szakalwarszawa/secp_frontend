import { apiService } from './api.service';
import { userConstants } from '../_constants';

function logout() {
  // remove user from local storage to log user out
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        // eslint-disable-next-line no-restricted-globals
        // location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`${process.env.REACT_APP_API_URL}/authentication_token`, requestOptions)
    .then(handleResponse)
    .then((token) => {
      // store user details and jwt token in session storage to keep user logged
      // in between page refreshes
      sessionStorage.setItem('token', JSON.stringify(token.token));

      return token;
    });
}

function callForOwnUserData() {
  return apiService.get('users/me')
    .then((result) => {
      sessionStorage.setItem('user', JSON.stringify(result));

      return result;
    });
}

function refresh() {
  callForOwnUserData();
}

function getUserData() {
  return JSON.parse(sessionStorage.getItem('user'));
}

function isAdmin() {
  const userRoles = getUserData().roles;
  const ownedAdminRoles = userRoles.filter(value => userConstants.ADMIN_ROLES.includes(value));

  return (ownedAdminRoles.length > 0);
}

export const userService = {
  login,
  logout,
  callForOwnUserData,
  getUserData,
  isAdmin,
  refresh,
};
