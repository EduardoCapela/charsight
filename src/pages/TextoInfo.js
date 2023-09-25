import React, { useState, useRef, useEffect } from 'react';
import "../Styles/TextoInfo.css";
import { franc } from 'franc-min';
import firebase from './firebase'; 
import Anuncio from './Anuncio';

const TextoInfo = () => {
  const [texto, setTexto] = useState('');
  const [palavras, setPalavras] = useState(0);
  const [linhas, setLinhas] = useState(0);
  const [wordFrequency, setWordFrequency] = useState({});
  const [averageWordLength, setAverageWordLength] = useState(0);
  const [longestWord, setLongestWord] = useState('');
  const [shortestWord, setShortestWord] = useState('');
  const [readingTime, setReadingTime] = useState(0);
  const fileInputRef = useRef(null);
  const [showWordFrequency, setShowWordFrequency] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('');

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

  

  const contarPalavrasLinhas = (texto) => {
    const textarea = document.getElementById('markdown-textarea');
  
    // Calculate the content lines based on newline characters
    const contentLines = texto.split('\n').length;
  
    // Update the number of visible rows dynamically based on content lines
    textarea.rows = contentLines;
  
    setPalavras(texto.trim().split(/\s+/).length);
    setLinhas(contentLines);
  };

  

  const calcularWordFrequency = (texto) => {
    const words = texto
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const wordFrequencyMap = {};

    words.forEach((word) => {
      if (wordFrequencyMap[word]) {
        wordFrequencyMap[word]++;
      } else {
        wordFrequencyMap[word] = 1;
      }
    });

    setWordFrequency(wordFrequencyMap);
  };

  const calcularAverageWordLength = (texto) => {
    const words = texto
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const totalLength = words.reduce((acc, word) => acc + word.length, 0);
    const averageLength = totalLength / words.length || 0;
    setAverageWordLength(averageLength.toFixed(2));
  };

  const findLongestAndShortestWords = (texto) => {
    const words = texto
      .trim()
      .split(/\s+/);
  
    let longest = '';
    let shortest = words[0] || '';
  
    words.forEach((word) => {
      if (word.length > longest.length) {
        longest = word;
      }
      if (word.length < shortest.length) {
        shortest = word;
      }
    });
  
    // Remove unwanted characters from the shortest word
    shortest = shortest.replace(/[-'\/]/g, '');
  
    setLongestWord(longest);
    setShortestWord(shortest);
  };

  const estimateReadingTime = (texto) => {
    const words = texto
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Assuming a standard reading speed of 200 words per minute
    const wordsPerMinute = 200;
    const readingTimeInMinutes = words.length / wordsPerMinute;
    setReadingTime(readingTimeInMinutes.toFixed(2));
  };

  const handleChangeTexto = (event) => {
    const novoTexto = event.target.value;
    setTexto(novoTexto);
    contarPalavrasLinhas(novoTexto);
    calcularWordFrequency(novoTexto);
    calcularAverageWordLength(novoTexto);
    findLongestAndShortestWords(novoTexto);
    estimateReadingTime(novoTexto);
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Read the contents of the selected Word document
      const reader = new FileReader();
      reader.onload = (e) => {
        // Set the textarea value to the content of the Word document
        setTexto(e.target.result);
        contarPalavrasLinhas(e.target.result);
        calcularWordFrequency(e.target.result);
        calcularAverageWordLength(e.target.result);
        findLongestAndShortestWords(e.target.result);
        estimateReadingTime(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const toggleWordFrequency = () => {
    setShowWordFrequency(!showWordFrequency);
  };

  const languageNames = {
    eng: 'Inglês',
    spa: 'Espanhol',
    por: 'Português',
    deu: 'Alemão',
    fra: 'Francês',
    rus: 'Russo',
    ita: 'Italiano',
    nld: 'Holandês',
    swe: 'Sueco',
    nor: 'Norueguês',
    dan: 'Dinamarquês',
    fin: 'Finlandês',
    ell: 'Grego',
    hun: 'Húngaro',
    tur: 'Turco',
    ara: 'Árabe',
    heb: 'Hebraico',
    jpn: 'Japonês',
    zho: 'Chinês',
    kor: 'Coreano',
    pol: 'Polonês',
    // Adicione mais idiomas conforme necessário
  };

  useEffect(() => {
    // Detect the language whenever the text changes
    if (texto) {
      const detectedLangCode = franc(texto);
      const detectedLang = languageNames[detectedLangCode]; // Get the full language name
      setDetectedLanguage(detectedLang || 'Unknown'); // Use 'Unknown' if the language code is not in the mapping
    }
  }, [texto]);

  return (
    <div className="responsive-container">
      {!user && <Anuncio />}
      <h2 className="converter-title" style={{color: '#000'}}>Informações sobre um texto</h2>
      <div className="markdown-container">
      <textarea
        id="markdown-textarea"
        value={texto}
        onChange={handleChangeTexto}
        rows={1} // Adjust the number of visible rows
        className="markdown-textarea" // Apply CSS class for styling
      />
        <div className="markdown-preview">
          <ul className="conversation-list">
            <li className="conversation-item">
              <span className="word-count">Quantidade de Palavras: {palavras}</span>
            </li>
            <li className="conversation-item">
              <span className="line-count">Quantidade de Linhas: {linhas}</span>
            </li>
            <li className="conversation-item">
              <button onClick={toggleWordFrequency} className="center-button">Frequência de Palavras</button>
              {showWordFrequency && (
                <div>
                  <ul>
                    {Object.keys(wordFrequency).map((word) => (
                      <li key={word}>
                        {word}: {wordFrequency[word]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li className="conversation-item">
              <span className="average-word-length">Comprimento médio da palavra: {averageWordLength} char</span>
            </li>
            <li className="conversation-item">
              <span className="longest-word">Palavra maior: {longestWord}</span>
            </li>
            <li className="conversation-item">
              <span className="shortest-word">Palavra menor: {shortestWord}</span>
            </li>
            <li className="conversation-item">
          <span className="detected-language">Linguagem detetada: {detectedLanguage}</span>
        </li>
            <li className="conversation-item">
              <span className="reading-time">Tempo de leitura aproximado: {readingTime} minutes</span>
            </li>
            
          </ul>
        </div>
      </div>
      <div>
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      </div>
      <button onClick={() => fileInputRef.current.click()} className="center-button">Importar Documento</button>

    </div>

  );
};

export default TextoInfo;