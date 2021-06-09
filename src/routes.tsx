import React from "react";

import LandingPage from "pages/Landing";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={LandingPage} />
        {/* <Route path="/resultado" exact component={LandingPage} /> */}
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
