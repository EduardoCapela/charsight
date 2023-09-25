import { useState, useEffect } from "react";
import "../Styles/Translator.css";
import firebase from './firebase'; 
import Anuncio from './Anuncio';
import { AiOutlineClose } from 'react-icons/ai';


const Tradutor = () => {
  const [inputText, setInputText] = useState('');
  const [outputLang, setOutputLang] = useState('pt');
  const [outputText, setOutputText] = useState('');
  const [isTranslated, setIsTranslated] = useState();

  const cleanTextForTranslation = (text) => {
    // Remove espaços duplicados
    const cleanedText = text.replace(/\s+/g, ' ');
  
    // Remove parágrafos
    const textWithoutParagraphs = cleanedText.replace(/\n+/g, ' ');
  
    return textWithoutParagraphs;
  };
  
  const translate = async () => {
    setIsTranslated(null); // Limpa o estado de tradução anterior
    console.log(outputLang);
  
    // Limpa o texto antes da tradução
    const cleanedText = cleanTextForTranslation(inputText);
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_KEY,
        'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
        'Accept-Encoding': 'gzip' // Desativa a decodificação de conteúdo
      },
      body: JSON.stringify([{ Text: cleanedText }])
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_TRADUTOR1_KEY}${outputLang}${process.env.REACT_APP_TRADUTOR2_KEY}`, options);
  
      if (!response.ok) {
        throw new Error('Erro ao traduzir o texto.');
      }
  
      const translationData = await response.json();
      const translatedText = translationData[0].translations[0].text;
      setOutputText(translatedText);
      setIsTranslated(true);
      console.log(translatedText);
    } catch (error) {
      setIsTranslated(false);
      console.error('Erro na tradução:', error);
    }
  }

  const clearInput = () => {
    setInputText('');
    setOutputText('');
    setIsTranslated();
  }

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
    <section className="translator">
      <h2 className="converter-title">Tradutor</h2>
      <div className="row-wrapper">
        <div className="translator-container input-lang">
          <div className="top-row">
            <button
              className="btn btn-primary btn-translate"
              onClick={translate}
            >
              Traduzir
            </button>
          </div>
          <form className="input-form">
            <textarea
              className="text-box"
              placeholder="Introduz o texto (qualquer linguagem)"
              onChange={e => setInputText(e.target.value)}
              value={inputText}
            >
            </textarea>
            {
              inputText !== "" &&
              <AiOutlineClose
                className="icon-btn close-btn"
                onClick={clearInput}
              />
            }
          </form>
        </div>
        <div className="translator-container output-lang">
          <div className="top-row">
            <select
              name="languages"
              id="languages"
              className="form-select form-select-sm"
              onChange={e => setOutputLang(e.target.value)}
            >
              <option value="pt">Português</option>
              <option value="en">Inglês</option>
              <option value="fr">Francês</option>
              <option value="de">Alemão</option>
              <option value="es">Espanhol</option>
            </select>
          </div>
          <p className="text-box output-box">
            {
              isTranslated === false ?
                <span className="output-placeholder translation-error">Tradução falhou</span>
                :
                outputText === "" ?
                  <span className="output-placeholder">Escolhe a linguagem</span>
                  :
                  outputText
            }
          </p>
        </div>
      </div>
      {!user && <Anuncio />}
    </section>
  );
}

export default Tradutor;