import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './css/style.css';
import Modal from 'react-modal';


const root = ReactDOM.createRoot(document.getElementById('root'));

// Define o elemento principal da aplicação para o react-modal
Modal.setAppElement('#root'); // ou substitua '#root' pelo seletor do seu elemento principal

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);
