const http = require('http');
const https = require('https');

const PORT = 8080;

http.createServer((clientReq, clientRes) => {
    // Handle OPTIONS (pre-flight) requests
    if (clientReq.method === 'OPTIONS') {
        clientRes.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        clientRes.end();
        return;
    }

    const options = {
        hostname: 'libretranslate.com',
        port: 443,
        path: clientReq.url,
        method: clientReq.method,
        headers: clientReq.headers
    };

    const proxy = https.request({ ...options, rejectUnauthorized: false }, (serverRes) => {
        clientRes.writeHead(serverRes.statusCode, {
            ...serverRes.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        serverRes.pipe(clientRes, { end: true });
    });

    clientReq.pipe(proxy, { end: true });
}).listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
