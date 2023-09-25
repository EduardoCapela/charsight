import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Importe o Navigate do React Router
import firebase from './firebase';
import Anuncio from './Anuncio';
import '../Styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [redirectToConta, setRedirectToConta] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, senha);
      setError('Login Bem sucedido');

      // Adicione um atraso de 2 segundos antes de redirecionar
      setTimeout(() => {
        setRedirectToConta(true);
      }, 1500);
    } catch (error) {
      setError('Erro no login');
    }
  };

  return (
    <div className="login-container">
      {!user && <Anuncio />}
      <h2 className="login-title">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="login-input"
      />
      <button onClick={handleLogin} className="login-button">
        Login
      </button>
      {error && <p className="error-message">{error}</p>}
      <p className="register-link">
        Ainda não tem uma conta? Faça <Link to="/registo">registro</Link>.
      </p>
      {/* Use o componente Navigate para redirecionar o utilizador após o atraso */}
      {redirectToConta && <Navigate to="/conta" />}
    </div>
  );
};

export default Login;