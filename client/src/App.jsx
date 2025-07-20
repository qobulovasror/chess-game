import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./page/Game";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./page/Home";
import Multiplyer from "./page/Multiplyer";
import PlayWithComputer from "./page/PlayWithComp";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <ToastContainer />
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
