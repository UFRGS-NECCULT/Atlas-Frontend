import React from "react";

import LandingPage from "pages/Landing";
import DataVisualization from "pages/DataVisualization";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/resultado" exact component={DataVisualization} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
