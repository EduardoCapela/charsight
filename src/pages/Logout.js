import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Importe o Navigate do React Router
import firebase from './firebase';
import '../Styles/styles.css';

const Logout = () => {
  const [error, setError] = useState('');
  const user = firebase.auth().currentUser;
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      setError('Logout Bem sucedido');

      // Adicione um atraso de 2 segundos antes de redirecionar
      setTimeout(() => {
        setRedirectToLogin(true);
      }, 1500);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="logout-container">
        <h2 className="page-title">Conta</h2>
        <p>Email: {user ? user.email : 'X'}</p>
        <button onClick={handleLogout} className="center-button">
          Logout
        </button>
        {error && <p className="error-message">{error}</p>}
        {/* Use o componente Navigate para redirecionar o utilizador para a página de login após o atraso */}
        {redirectToLogin && <Navigate to="/login" />}
      </div>
    </div>
  );
};

export default Logout;