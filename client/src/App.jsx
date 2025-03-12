import Game from './Game'
import { ThemeProvider } from "@/components/theme-provider"


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     <Game/>
    </ThemeProvider>
  )
}

export default App
