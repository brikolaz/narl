import "./App.css";
import { Main } from "./components/Main";
import { GameProvider } from "./game/state/provider";

const App = () => {
  return (
    <GameProvider>
      <Main />
    </GameProvider>
  );
};

export default App;
