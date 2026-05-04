import "./App.css";
import { Game } from "./components/Game";
import { GameProvider } from "./game/state/provider";
import { enableArrayMethods, enableMapSet } from "immer";

enableMapSet();
enableArrayMethods();

const App = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default App;
