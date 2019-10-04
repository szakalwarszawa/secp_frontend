import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, accessRight, ...rest }) => {
  if (accessRight) {
    return (
      <Route
        {...rest}
        render={props => (
          sessionStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )}
      />
    );
  }
  return '';
};
