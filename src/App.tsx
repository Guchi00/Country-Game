import React from "react";
import { Game } from "./Components/Game";
import { DATA } from "./Data";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Game data={DATA} />
    </div>
  );
}

export default App;
