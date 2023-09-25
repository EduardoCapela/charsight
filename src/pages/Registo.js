import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Importe o Navigate do React Router
import firebase from './firebase';
import Anuncio from './Anuncio';

const Registro = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleRegistro = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, senha);
      setError('Registro bem-sucedido!');

      // Adicione um atraso de 2 segundos antes de redirecionar
      setTimeout(() => {
        setRedirectToLogin(true);
      }, 1500);
    } catch (error) {
      setError(`Erro ao registrar: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Registro</h2>
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
      <button onClick={handleRegistro} className="login-button">
        Registrar
      </button>
      {error && <p className="error-message">{error}</p>}
      <p className="register-link">
        Já tem uma conta? Faça <Link to="/login">login</Link>.
      </p>
      {redirectToLogin && <Navigate to="/login" />} {/* Redirecione após o atraso */}
      <Anuncio />
    </div>
  );
};

export default Registro;