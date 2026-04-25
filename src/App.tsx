import "./App.css";
import { Game } from "./components/Game";
import { GameProvider } from "./game/state/provider";

const App = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default App;
