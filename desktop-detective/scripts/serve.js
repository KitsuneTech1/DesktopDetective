const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 8000);
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

function sendText(response, statusCode, message) {
    response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(message);
}

function createServer() {
    return http.createServer((request, response) => {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            sendText(response, 405, 'Method not allowed');
            return;
        }

        let requestPath;
        try {
            requestPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        } catch {
            sendText(response, 400, 'Bad request');
            return;
        }

        const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
        const filePath = path.resolve(root, relativePath);
        if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
            sendText(response, 403, 'Forbidden');
            return;
        }

        fs.stat(filePath, (error, stats) => {
            if (error || !stats.isFile()) {
                sendText(response, 404, 'Not found');
                return;
            }

            response.writeHead(200, {
                'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
            });
            if (request.method === 'HEAD') {
                response.end();
                return;
            }
            fs.createReadStream(filePath).pipe(response);
        });
    });
}

const server = createServer();
server.listen(port, '127.0.0.1', () => {
    console.log(`Desktop Detective running at http://127.0.0.1:${port}`);
});
