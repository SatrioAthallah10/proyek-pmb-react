import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Mengimpor file CSS global

/**
 * Ini adalah titik masuk (entry point) utama untuk aplikasi React.
 * Kode ini mengambil komponen <App /> dan merendernya ke dalam
 * elemen HTML dengan id 'root' yang ada di file index.html.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
