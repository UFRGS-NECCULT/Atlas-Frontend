import React from "react";

import { DataProvider } from "./DataContext";
import { SelectionProvider } from "./SelectionContext";

const AppProvider: React.FC = ({ children }) => (
  <DataProvider>
    <SelectionProvider>{children}</SelectionProvider>
  </DataProvider>
);

export default AppProvider;
