import React from 'react';
import { Route, Redirect } from 'react-router-dom';
//import UserContext from '../../Contexts/UserContext';
import TokenService from '../../Services/token-service';

export default function PrivateOnlyRoute({ component, ...props }) {
  const Component = component;
  
  return (
    <Route
      {...props}
      render={componentProps => (
            TokenService.hasAuthToken()
              ? <Component {...componentProps} />
              : (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: componentProps.location },
                  }}
                />
              )
      )}
    />
  )
};


