import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Tools from "./pages/Tools";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Tools />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
