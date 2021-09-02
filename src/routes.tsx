import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AppProvider from "hooks";

const LandingPage = lazy(() => import("./pages/Landing"));
const DataVisualizationPage = lazy(() => import("./pages/DataVisualization"));
const LibrasDisabler = lazy(() => import("./components/LibrasDisabler"));

const Routes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<h1>loading</h1>}>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <AppProvider>
            <LibrasDisabler>
              <Route path="/resultado" exact component={DataVisualizationPage} />
            </LibrasDisabler>
          </AppProvider>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
