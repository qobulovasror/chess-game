import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Game";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./Home";
// import Dashboard from "./Dashboard";
// import CreateOrJoin from "./CreateOrJoin";
// import Project from "./Project";
// import Multiplyer from "./Multiplyer";
// import PlayWithComp from "./PlayWithComp"; // Noto‘g‘ri yozilgan nomni to‘g‘rilandi

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Game />} />
          {/* <Route path="/multiplayer" element={<Multiplyer />} /> */}
          {/* <Route path="/playWithComp" element={<PlayWithComp />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<CreateOrJoin />} />
            <Route path="game" element={<Project />} />
          </Route>*/}
        </Routes> 
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
