import { userService } from '.';
import { authHeader } from '../_helpers/authHeader';
import { history } from '../_helpers';

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        userService.logout();
        history.push('/login/');
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export const apiService = {
  get: (apiMethod, secured = true) => {
    const requestOptions = {
      method: 'GET',
      headers: authHeader(secured),
    };

    return fetch(`${process.env.REACT_APP_API_URL}/api/${apiMethod}`, requestOptions)
      .then(handleResponse);
  },

  post: (apiMethod, body = null, secured = true) => {
    const requestOptions = {
      method: 'POST',
      headers: { ...authHeader(secured), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    return fetch(`${process.env.REACT_APP_API_URL}/api/${apiMethod}`, requestOptions)
      .then(handleResponse);
  },

  put: (apiMethod, body = null, secured = true) => {
    const requestOptions = {
      method: 'PUT',
      headers: { ...authHeader(secured), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };

    return fetch(`${process.env.REACT_APP_API_URL}/api/${apiMethod}`, requestOptions)
      .then(handleResponse);
  },

  delete: (apiMethod, secured = true) => {
    const requestOptions = {
      method: 'DELETE',
      headers: authHeader(secured),
    };

    return fetch(`${process.env.REACT_APP_API_URL}/api/${apiMethod}`, requestOptions)
      .then(handleResponse);
  },
};
