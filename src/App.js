import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
//import Header from './Components/Header/Header';

/* import route js files */
import GameroomRoute from './Routes/GameroomRoute/GameroomRoute';
import HelpRoute from './Routes/HelpRoute/HelpRoute';
import LandingRoute from './Routes/LandingRoute/LandingRoute';
import LoginRoute from './Routes/LoginRoute/LoginRoute';
import PrivateOnlyRoute from './Components/PrivateOnlyRoute/PrivateOnlyRoute';
import PublicOnlyRoute from './Components/PublicOnlyRoute/PublicOnlyRoute';
import ResultRoute from './Routes/ResultRoute/ResultRoute';
import SettingRoute from './Routes/SettingRoute/SettingRoute';
import SignupRoute from './Routes/SignupRoute/SignupRoute';
import DashboardRoute from './Routes/DashboardRoute/DashboardRoute';
import NotFoundRoute from './Routes/NotFoundRoute/NotFoundRoute';
import DeleteAccountRoute from './Routes/DeleteAccountRoute/DeleteAccountRoute';
import PasswordChangeRoute from './Routes/PasswordChangeRoute/PasswordChangeRoute';
import ResetAccountRoute from './Routes/ResetAccountRoute/ResetAccountRoute';
import UsernameChangeRoute from './Routes/UsernameChangeRoute/UsernameChangeRoute';

export default class App extends Component {
 

  render() {
    return (
      <div className="app">
        <main>
          <Switch>
            <Route
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
            {/* <PublicOnlyRoute 
              exact
              path={'/help'}
              component={HelpRoute}
            /> */}
            <PrivateOnlyRoute
              exact
              path={'/help'}
              component={HelpRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/dashboard'}
              component={DashboardRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/setting'}
              component={SettingRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/result'}
              component={ResultRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/gameroom'}
              component={GameroomRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/deleteAccount'}
              component={DeleteAccountRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/ResetAccount'}
              component={ResetAccountRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/passwordChange'}
              component={PasswordChangeRoute}
            />
            <PrivateOnlyRoute
              exact
              path={'/UsernameChange'}
              component={UsernameChangeRoute}
            />
            
            <Route
              component={NotFoundRoute}
            />
          </Switch>
        </main>

      </div>
    );
  }
};


