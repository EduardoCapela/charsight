import React, { useEffect, useState } from 'react';
import firebase from './firebase'; 
import Anuncio from './Anuncio';
import { Configuration, OpenAIApi } from "openai";
import "../Styles/ChatBot.css"


const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.REACT_APP_AI_KEY,
    
  })
);

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]); // Armazenar histórico de mensagens
  const [isLoading, setIsLoading] = useState(false); // Variável de estado para rastrear o carregamento

  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
  
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
      });
  
      const newMessage = { role: 'user', content: userMessage };
      const newResponseMessage = { role: 'ai', content: response.data.choices[0].message.content };
  
      setMessageHistory([...messageHistory, newMessage, newResponseMessage]);
  
      setUserMessage(''); // Clear the user's message after sending
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      handleSendMessage(); // Sends the message
    }
  };

  const [user, setUser] = useState(null); // Adicione o estado do usuário

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
    <div>
      {!user && <Anuncio />}
      <div className="chatbot-container">
      <h2>ChatBot</h2>
        <div className="chatbot-messages" >
          {/* Renderize todas as mensagens no histórico */}
          {messageHistory.map((message, index) => (
            <div key={index} className={`message ${message.role} `} style={{ maxWidth: "350px" }}>
              {message.content}
            </div>
          ))}
          {/* Indicador de carregamento */}
          {isLoading && <div className="loading-indicator">Carregando...</div>}
        </div>
        <div className="user-input-container">
          <input
            className="user-input"
            type="text"
            placeholder="Escreve uma mensagem"
            value={userMessage}
            onChange={handleUserMessageChange}
            onKeyDown={handleKeyDown}
            style={{
              height: "60px", // Altura inicial
              maxHeight: "200px", // Altura máxima antes da rolagem
            }}
          />
          <button className="send-button" onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;