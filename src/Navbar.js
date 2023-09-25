import { Link, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Styles/styles.css";
import firebase from './pages/firebase';

export default function Navbar() {
  const navRef = useRef();
  const location = useLocation();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Use o Firebase Auth para verificar o estado do usuário
    firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
    });
  }, []);


  // Componente de botão personalizado que fica ativo (selecionado) com base na rota atual
  function CustomNavLink({ to, children }) {
    const currentPath = location.pathname;
    const isActive = currentPath === to;

    return (
      <li>
        <Link
          to={to}
          className={`nav-btn1 ${isActive ? "active" : ""}`}
          onClick={showNavbar}
        >
          {children}
        </Link>
      </li>
    );
  }

  return (
    <header>
      <Link to="/" className="site-title">
      
      </Link>
      <nav ref={navRef}>
        <CustomNavLink to="/TextoInfo">TextoInfo</CustomNavLink>
        <CustomNavLink to="/TextoFoto">TextoFoto</CustomNavLink>
        <CustomNavLink to="/ChatBot">ChatBot</CustomNavLink>
        <CustomNavLink to="/Tradutor">Tradutor</CustomNavLink>
        <CustomNavLink to="/QRCode">QRCode</CustomNavLink>
        {/* Exiba o botão "Logout" quando o utilizador estiver logado */}
        {user ? (
          <CustomNavLink to="/Conta">Conta</CustomNavLink>
        ) : (
          <CustomNavLink to="/login">Login</CustomNavLink>
        )}
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}