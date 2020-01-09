import React from 'react';
import { Route, Redirect } from 'react-router-dom';
//import UserContext from '../../Contexts/UserContext';
import TokenService from '../../Services/token-service';

export default function PublicOnlyRoute({ component, ...props }) {
  const Component = component;

  return (
    <Route
      {...props}
      render={componentProps => (
            TokenService.hasAuthToken()
              ? <Redirect to={'/'} />
              : <Component {...componentProps} />
          
      )}
    />
  )
};


