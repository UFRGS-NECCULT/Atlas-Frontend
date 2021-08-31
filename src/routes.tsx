import React from "react";

import LandingPage from "pages/Landing";
import AppProvider from "hooks";
import DataVisualization from "pages/DataVisualization";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <AppProvider>
          <Route path="/resultado" exact component={DataVisualization} />
        </AppProvider>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
