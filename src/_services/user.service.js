import { apiService } from './api.service';
import { userConstants } from '../_constants';
import { messageTranslate } from '../_helpers/messageTranslations';

function logout() {
  // remove user from local storage to log user out
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      let error = (data && data.message) || response.statusText;

      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        error = (data && messageTranslate(data.message)) || response.statusText;
      }

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

function callForApiVersion() {
  return apiService.get('application/info')
    .then((result) => {
      sessionStorage.setItem('api', JSON.stringify(result));
      console.info(`API_TAG: ${result.git_tag}`);
      console.info(`API_GIT: ${result.git_commit}`);
      console.info(`API_DATE: ${result.deploy_time}`);

      return result;
    });
}

function callForOwnUserData() {
  return apiService.get('users/me')
    .then((result) => {
      sessionStorage.setItem('user', JSON.stringify(result));
      callForApiVersion();

      return result;
    });
}

function refresh() {
  callForOwnUserData();
}

function getUserData() {
  return JSON.parse(sessionStorage.getItem('user'));
}

/**
 * @returns {number}
 */
function getUserId() {
  const userData = getUserData();
  if (!userData) {
    return 0;
  }
  return parseInt(userData.id || 0, 0);
}

/**
 * @param {string[]} roleList
 * @returns {boolean}
 */
function userHasRole(roleList) {
  if (!getUserData()) {
    return false;
  }
  const userRoles = getUserData().roles;
  const ownedRoles = userRoles.filter((value) => roleList.includes(value));

  return (ownedRoles.length > 0);
}

/**
 * @returns {boolean}
 */
function isAdmin() {
  return userHasRole(userConstants.ADMIN_ROLES);
}

/**
 * @returns {boolean}
 */
function isHR() {
  return userHasRole(userConstants.HR_ROLES);
}

/**
 * @returns {boolean}
 */
function isDepartmentManager() {
  return userHasRole(userConstants.DEPARTMENT_MANAGER_ROLES);
}

/**
 * @returns {boolean}
 */
function isSectionManager() {
  return userHasRole(userConstants.SECTION_MANAGER_ROLES);
}

/**
 * @returns {boolean}
 */
function isSecretary() {
  return userHasRole(userConstants.SECRETARY_ROLES);
}

export const userService = {
  login,
  logout,
  callForOwnUserData,
  callForApiVersion,
  getUserData,
  getUserId,
  userHasRole,
  isAdmin,
  isHR,
  isDepartmentManager,
  isSectionManager,
  isSecretary,
  refresh,
};
