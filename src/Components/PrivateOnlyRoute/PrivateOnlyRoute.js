import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserContext from '../../Contexts/UserContext';

export default function PrivateOnlyRoute({ component, ...props }) {
  const Component = component;
  
  return (
    <Route
      {...props}
      render={componentProps => (
        <UserContext.Consumer>
          {userContext =>
            !!userContext.user.id
              ? <Component {...componentProps} />
              : (
                <Redirect
                  to={{
                    pathname: userContext.user.idle ? '/login' : '/help',
                    state: { from: componentProps.location },
                  }}
                />
              )
          }
        </UserContext.Consumer>
      )}
    />
  )
};


