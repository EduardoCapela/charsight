import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import firebase from './firebase';
import Anuncio from './Anuncio';
import '../Styles/TextoFoto.css'

const TextoImagem = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!image) {
      setError('Por favor, selecione uma imagem antes de converter.');
      return;
    }

    try {
      const { data: { text } } = await Tesseract.recognize(image, 'por');
      setText(text);
    } catch (err) {
      setError('Ocorreu um erro ao converter a imagem em texto.');
      console.error(err);
    }
  };

  const [user, setUser] = useState(null); // Adicione o estado do utilizador

  useEffect(() => {
    // Use o Firebase Auth para verificar o estado do utilizador
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        // O utilizador está logado, atualize o estado do utilizador
        setUser(authUser);
      } else {
        // O utilizador não está logado, defina o estado do utilizador como nulo
        setUser(null);
      }
    });
  }, []);
  

  return (
    <div className="texto-imagem-container">
      <h2 className="texto-imagem-title">Conversor de Imagem para Texto</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} id="image" className="image-input" />
      <label htmlFor="image" className="image-label">
        Selecionar Imagem
      </label>
      {error && <p className="error-message">{error}</p>}
      {image && <img src={image} alt="Imagem selecionada" className="image-preview" />}
      {text && <div className="converted-text">
        <h3>Texto Convertido:</h3>
        <div
      contentEditable // Adicionando a propriedade contentEditable
      value={text} // Trocando value por dangerouslySetInnerHTML
      dangerouslySetInnerHTML={{ __html: text }}
      rows={15} // Pode ser removido, pois não se aplica a contentEditable
      className="markdown-textarea2" // Pode ser removido, pois não se aplica a contentEditable
    />
  </div>}
      <button onClick={handleConvert} className="convert-button">Converter</button>
      {!user && <Anuncio />}
    </div>
  );
};

export default TextoImagem;