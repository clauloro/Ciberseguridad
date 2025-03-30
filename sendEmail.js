const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Cargar credenciales desde el archivo JSON
const credentials = JSON.parse(fs.readFileSync('client.json'));
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Ruta donde se guardará el token de acceso
const TOKEN_PATH = 'token.json';

// Función para obtener un nuevo token de acceso
function getAccessToken() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.send'],
    });

    console.log('Autoriza el acceso visitando este enlace:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Introduce el código de autorización: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error al obtener el token de acceso:', err);
                return;
            }
            oAuth2Client.setCredentials(token);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('Token almacenado correctamente.');
            sendEmail();
        });
    });
}

// Función para enviar un correo electrónico
async function sendEmail() {
    try {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const email = 
`From: support@gmail.com
To: claudyaloro@gmail.com
Subject: Alerta de seguridad: Intento de acceso a tu cuenta de Google
MIME-Version: 1.0
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto; }
        .btn { background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Intento de acceso sospechoso</h2>
        <p>Hemos detectado un intento de inicio de sesión en tu cuenta desde una ubicación desconocida. Si no has sido tú quien ha iniciado sesión, te sugerimos que revises la actividad de tu cuenta.</p>
        <p><strong>Detalles del intento:</strong></p>
        <ul>
            <li>Ubicación: España</li>
            <li>Dispositivo: Windows</li>
            <li>Fecha: 3 de abril, 2025</li>
        </ul>
        <p>Si no fuiste tú, por favor verifica tu cuenta inmediatamente.</p>
        <p>
            <a href="https://ciberseguridad-sigma.vercel.app" class="btn">Verificar actividad</a>
        </p>
    </div>
</body>
</html>`;

        const encodedMessage = Buffer.from(email)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, ''); // Elimina caracteres de relleno '='

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log('Correo enviado con éxito:', response.data);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

// Verificar si el token ya existe
if (fs.existsSync(TOKEN_PATH)) {
    sendEmail();
} else {
    getAccessToken();
}
