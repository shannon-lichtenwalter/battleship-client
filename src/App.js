import React, { Component } from 'react';
import { Route, Switch } from 'react-route-dom';
import './App.css';

/* import route js files */
import GameroomRoute from './Routes/GameroomRoute/GameroomRoute';
import HelpRoute from './Routes/HelpRoute/HelpRoute';
import LandingRoute from './Routes/LandingRoute/LandingRoute';
import LoginRoute from './Routes/LoginRoute/LoginRoute';
import PrivateOnlyRoute from './Componenets/PrivateOnlyRoute/PrivateOnlyRoute';
import PublicOnlyRoute from './Componenets/PublicOnlyRoute/PublicOnlyRoute';
import ResultRoute from './Routes/ResultRoute/ResultRoute';
import SettingRoute from './Routes/SettingRoute/SettingRoute';
import SignupRoute from './Routes/SignupRoute/SignupRoute';
import DashboardRoute from './Routes/DashboardRoute/DashboardRoute';

export default class App extends Component {
  
  render() {
    return (
      <div className="App">
        <main>
          <Switch>
          <PublicOnlyRoute
              exact
              path={'/'}
              component={LandingRoute}
            />
            <PublicOnlyRoute
              exact
              path={'/signup'}
              component={SignupRoute}
            />
            <PublicOnlyRoute
              exact
              path={'/login'}
              component={LoginRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/dashboard'}
              component={DashboardRoute}
            />
          </Switch>
        </main>
      </div>
    );
  }
  
};


