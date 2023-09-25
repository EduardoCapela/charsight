import Navbar from "./Navbar"
import TextoInfo from "./pages/TextoInfo"
import Home from "./pages/Home"
import ChatBot from "./pages/ChatBot"
import Tradutor from "./pages/Tradutor"
import Login from "./pages/Login"
import Logout from "./pages/Logout"
import TextoFoto from "./pages/TextoFoto"
import Registo from "./pages/Registo"
import QRCode from "./pages/QRCode"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/TextoInfo" element={<TextoInfo />} />
          <Route path="/ChatBot" element={<ChatBot />} />
          <Route path="/TextoFoto" element={<TextoFoto />} />
          <Route path="/tradutor" element={<Tradutor />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/QRCode" element={<QRCode />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Conta" element={<Logout />} />
        </Routes>
      </div>
    </>
  )
}

export default App
