const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

function parsePort(value) {
    if (value === undefined || value === null || value === '') return 8000;

    if (!/^\d+$/.test(String(value))) {
        throw new RangeError('PORT must be an integer from 0 to 65535');
    }

    const port = Number(value);
    if (!Number.isInteger(port) || port < 0 || port > 65535) {
        throw new RangeError('PORT must be an integer from 0 to 65535');
    }
    return port;
}

function isPathInside(rootDirectory, filePath) {
    const relativeToRoot = path.relative(rootDirectory, filePath);
    return relativeToRoot === '' ||
        (relativeToRoot !== '..' &&
            !relativeToRoot.startsWith(`..${path.sep}`) &&
            !path.isAbsolute(relativeToRoot));
}

function resolveFilePath(requestUrl, rootDirectory = root) {
    let requestPath;
    try {
        requestPath = decodeURIComponent(new URL(requestUrl, 'file:///').pathname);
    } catch {
        throw new URIError('Invalid request path');
    }

    if (requestPath.includes('\0')) {
        throw new URIError('Invalid request path');
    }

    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
    const filePath = path.resolve(rootDirectory, relativePath);
    if (!isPathInside(rootDirectory, filePath)) return null;

    return filePath;
}

function sendText(response, statusCode, message) {
    response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(message);
}

function createServer() {
    const realRoot = fs.realpathSync(root);

    return http.createServer((request, response) => {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
            sendText(response, 405, 'Method not allowed');
            return;
        }

        let filePath;
        try {
            filePath = resolveFilePath(request.url);
        } catch {
            sendText(response, 400, 'Bad request');
            return;
        }

        if (!filePath) {
            sendText(response, 403, 'Forbidden');
            return;
        }

        fs.realpath(filePath, (realPathError, realFilePath) => {
            if (realPathError) {
                sendText(response, 404, 'Not found');
                return;
            }

            if (!isPathInside(realRoot, realFilePath)) {
                sendText(response, 403, 'Forbidden');
                return;
            }

            fs.stat(realFilePath, (error, stats) => {
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
                const stream = fs.createReadStream(realFilePath);
                stream.on('error', () => {
                    if (response.headersSent) {
                        response.destroy();
                    } else {
                        sendText(response, 404, 'Not found');
                    }
                });
                stream.pipe(response);
            });
        });
    });
}

function startServer(port = parsePort(process.env.PORT)) {
    const server = createServer();
    server.listen(port, '127.0.0.1', () => {
        console.log(`Desktop Detective running at http://127.0.0.1:${port}`);
    });
    return server;
}

if (require.main === module) {
    startServer();
}

module.exports = { createServer, isPathInside, parsePort, resolveFilePath, startServer };
