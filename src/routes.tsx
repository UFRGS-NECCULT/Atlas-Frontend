import React from "react";

import LandingPage from "pages/Landing";
import AppProvider from "hooks";
import DataVisualization from "pages/DataVisualization";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { LibrasDisabler } from "components/LibrasDisabler";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <AppProvider>
          <LibrasDisabler>
            <Route path="/resultado" exact component={DataVisualization} />
          </LibrasDisabler>
        </AppProvider>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
