import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Game";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./Home";
import Multiplyer from "./Multiplyer";
import PlayWithComputer from "./PlayWithComp";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/multiplayer" element={<Multiplyer />} />
          <Route path="/playWithComputer" element={<PlayWithComputer />} />
        </Routes> 
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
