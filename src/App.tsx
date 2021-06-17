import React from "react";

import "./assets/styles/global.css";
import Routes from "routes";
import AppProvider from "hooks";

const App = () => {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
};

export default App;
