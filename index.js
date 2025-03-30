const express = require('express');
const path = require('path');
const app = express();

// Servir email.html como página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'email.html'));
});

// Servir index.html cuando se haga clic en el botón
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Servir archivos estáticos (importante para Vercel)
app.use(express.static(path.join(__dirname)));

// El puerto donde corre el servidor
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
