//importing global css
import "./css/normalize.css";
import "./css/index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RoleProvider } from "./context/RoleProvider";
import { ProgramsProvider } from "./context/ProgramsProvider";
import { ExercisesProvider } from "./context/ExercisesProvider";
import { HistoryProvider } from "./context/HistoryProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RoleProvider>
      <ProgramsProvider>
        <ExercisesProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </ExercisesProvider>
      </ProgramsProvider>
    </RoleProvider>
  </React.StrictMode>
);
