import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import "../Styles/QRCode.css";
import Anuncio from './Anuncio';
import firebase from './firebase'; 

const Conversor = () => {
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleDownloadQRCode = () => {
    try {
      if (text) {
        const canvas = document.querySelector("canvas");
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "qrcode.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao fazer download do QRCode:', error);
    }
  };

  return (
    <div className="converter-container">
      {!user && <Anuncio />}
      <h2 className="converter-title">Conversor de texto para QR Code</h2>
      <div className="converter-input">
        <textarea
          rows="8"
          cols="60"
          value={text}
          onChange={handleTextChange}
          placeholder="Digite o texto para converter em QRCode..."
          className="converter-textarea"
        />
      </div>
      {text && (
        <div className="converter-qrcode">
          <QRCode value={text} />
          
        </div>
      )}
      <button onClick={handleDownloadQRCode} className="download-button">
            Download QRCode
          </button>
      {!user && <Anuncio />}
    </div>
  );
};

export default Conversor;