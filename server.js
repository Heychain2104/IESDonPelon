const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Tus credenciales de Twitch (manténlas secretas en el backend)
const CLIENT_ID = 'oxc08qdnh3xt973libna6uhq0iupco';
const CLIENT_SECRET = '6wsq1ghbojqk0sv4fwrp3njzymtfoe';
const CHANNEL_NAME = 'donpelon_1';

let accessToken = '';

// Función para obtener token de Twitch
async function getToken() {
  const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
  const data = await res.json();
  accessToken = data.access_token;
  console.log('Token obtenido:', accessToken);
}

// Endpoint para traer streams
app.get('/api/streams', async (req, res) => {
  if (!accessToken) await getToken();

  // Obtener ID del broadcaster
  const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${CHANNEL_NAME}`, {
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const userData = await userRes.json();
  const broadcasterId = userData.data[0].id;

  // Obtener clips recientes
  const clipsRes = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&first=10`, {
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const clipsData = await clipsRes.json();
  res.json(clipsData);
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
