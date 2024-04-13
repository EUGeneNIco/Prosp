import { ThemeProvider } from "@/components/them-provider.tsx";
import { Dashboard } from "./components/Dashboard";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Chat } from "./components/Chat";
import { Login } from "./components/Login";

function App() {
  const wrapper = {
    maxWidth: '50rem',
    margin: '0 auto'
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <NavBar />
        <div style={wrapper}>
          <Routes>
            <Route path="/" Component={Dashboard} />
            <Route path="/chat/:id" Component={Chat} />
            <Route path="/login" Component={Login} />
          </Routes>
        </div>
      </Router>

    </ThemeProvider >
  )
}

export default App
