import PokemonGame from "./PokemonGame.jsx";
import Authentication from "./pages/Auth.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
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