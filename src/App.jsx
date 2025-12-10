import PokemonGame from "./PokemonGame.jsx";
import AudioControls from './components/AudioControls';
import Authentication from "./pages/Auth.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <AudioControls className="audio-controls" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/home" element={<PokemonGame />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;