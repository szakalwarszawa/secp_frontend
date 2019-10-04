import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, accessRight, ...rest }) => {

  const getRouteToRender = (props) => {
    if (!sessionStorage.getItem('token')) {
      const { location } = props;
      return (
        <Redirect to={{ pathname: '/login', state: { from: location } }} />
      );
    }

    if (accessRight) {
      return (
        <Component {...props} />
      );
    }

    return '';
  };

  return (
    <Route
      {...rest}
      render={props => getRouteToRender(props)}
    />
  );
};
