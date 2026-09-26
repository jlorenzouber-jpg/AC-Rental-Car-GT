const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (requestPath === '/') requestPath = '/index.html';
  if (requestPath.includes('..')) {
    res.writeHead(400); return res.end('Bad request');
  }
  const filePath = path.join(ROOT, requestPath);
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) return send(filePath, res);
    // SPA fallback
    send(path.join(ROOT, 'index.html'), res);
  });
});

function send(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(500); return res.end('Server error'); }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}

server.listen(PORT, '0.0.0.0', () => console.log(`AC Rental Car GT listening on ${PORT}`));
