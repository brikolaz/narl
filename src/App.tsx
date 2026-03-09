import { useEffect } from 'react'
import './App.css'
import { Game } from './components/game/Game'
import { GameProvider } from './state/game/provider'

function App() {

return (
  <GameProvider>
    <Game />
  </GameProvider>
)
}

export default App
