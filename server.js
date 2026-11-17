const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

/**
 * Resolves a request path to a file inside DIST_DIR, or null if the path would
 * escape the served directory. `path.join` alone is not enough: a URL such as
 * `/../../etc/passwd` is normalised by the join and lands outside DIST_DIR.
 */
function resolveInsideDist(reqPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(reqPath);
  } catch {
    // Malformed percent-encoding: treat as not found rather than crashing.
    return null;
  }
  // A NUL byte truncates the path in some syscalls; refuse it outright.
  if (decoded.includes('\0')) return null;

  const candidate = path.resolve(DIST_DIR, '.' + path.posix.normalize(decoded));
  const root = path.resolve(DIST_DIR) + path.sep;
  if (candidate !== path.resolve(DIST_DIR) && !candidate.startsWith(root)) {
    return null;
  }
  return candidate;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method Not Allowed');
    return;
  }

  const reqPath = req.url.split('?')[0].split('#')[0] || '/';
  const resolved = resolveInsideDist(reqPath === '/' ? '/index.html' : reqPath);

  if (!resolved) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  let filePath = resolved;

  // If path doesn't exist, fall back to index.html (SPA routing)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading ' + reqPath);
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(content);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});
