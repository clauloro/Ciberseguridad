const express = require('express');
const bodyParser = require('body-parser');

// Configuración del servidor Express
const app = express();
const PORT = 3000;

// Middleware para analizar las solicitudes POST (formulario)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para recibir los datos del formulario de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body; // Recibir los datos del formulario

    // Mostrar los datos en la terminal
    console.log("¡Nuevo intento de inicio de sesión!");
    console.log("Correo: " + email);
    console.log("Contraseña: " + password);
    
    res.status(200).send('Los datos de inicio de sesión han sido registrados en la terminal.');
});


// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
