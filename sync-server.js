/**
 * sync-server.js
 * Mini servidor WebSocket de sincronización en tiempo real para la PWA de Rutinas.
 * Permite que todos los dispositivos en la misma red Wi-Fi compartan el estado
 * de tareas y puntos en tiempo real sin necesitar internet ni cuentas externas.
 */

import { WebSocketServer, WebSocket } from 'ws';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createServer } from 'http';
import os from 'os';

const PORT = 4242;
const STATE_FILE = './sync-state.json';

// Estado compartido en memoria
let sharedState = null;

// Cargar estado guardado si existe
if (existsSync(STATE_FILE)) {
  try {
    sharedState = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
    console.log('📂 Estado previo cargado desde', STATE_FILE);
  } catch {
    console.log('⚠️  No se pudo leer el estado previo, iniciando limpio.');
  }
}

// Persistir estado en disco cada vez que cambia
function persistState(state) {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error guardando estado:', e.message);
  }
}

// Crear servidor HTTP base (necesario para entornos como Windows Firewall)
const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('Rutinas Jero Sync Server OK\n');
});

const wss = new WebSocketServer({ server: httpServer });

// Obtener IP local de la red Wi-Fi
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  console.log(`\n📱 Nuevo dispositivo conectado: ${clientIP}`);
  console.log(`   Total conectados: ${wss.clients.size}`);

  // Enviar el estado actual al dispositivo recién conectado
  if (sharedState) {
    ws.send(JSON.stringify({ type: 'FULL_STATE', payload: sharedState }));
    console.log('   ✅ Estado actual enviado al nuevo dispositivo.');
  } else {
    console.log('   ℹ️  No hay estado previo. Esperando primer sync del dispositivo.');
  }

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data.toString());
    } catch {
      console.error('Mensaje inválido recibido:', data.toString());
      return;
    }

    if (message.type === 'STATE_UPDATE') {
      // Guardar nuevo estado y hacer broadcast a todos los demás
      sharedState = message.payload;
      persistState(sharedState);

      let broadcastCount = 0;
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'FULL_STATE', payload: sharedState }));
          broadcastCount++;
        }
      });

      console.log(`🔄 Estado sincronizado → ${broadcastCount} dispositivo(s) actualizado(s)`);
    }
  });

  ws.on('close', () => {
    console.log(`\n📴 Dispositivo desconectado: ${clientIP}`);
    console.log(`   Total conectados: ${wss.clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('Error WebSocket:', err.message);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║      🟢 Servidor de Sincronización Activo        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`\n  📡 Puerto: ${PORT}`);
  console.log(`  🏠 Local:   ws://localhost:${PORT}`);
  console.log(`  📱 Red Wi-Fi: ws://${localIP}:${PORT}`);
  console.log('\n  Conecta los celulares a la misma red Wi-Fi.');
  console.log('  La app detectará el servidor automáticamente.\n');
});
