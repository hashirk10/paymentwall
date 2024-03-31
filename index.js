const http = require('http');
const url = require('url');
const querystring = require('querystring');
require('dotenv').config();

// Assuming Paymentwall module is correctly set up as per their documentation
const Paymentwall = require('paymentwall');
Paymentwall.Configure(
    Paymentwall.Base.API_GOODS,
    '769e42c1ad1be421ccad03967b4ca865', // Use your actual Paymentwall App Key
    'f691e3ccf8713ee0f248bf914ff7f7a0'  // Use your actual Paymentwall Secret Key
);

let paymentSuccessStates = {};

const server = http.createServer((req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);

        if (parsedUrl.pathname === '/pingback') {
            // Placeholder for pingback validation logic
            const isValidPingback = true; // This should be replaced with actual validation logic
            const userId = queryParams.userId; // Extract userId appropriately based on pingback data

            if (isValidPingback) {
                paymentSuccessStates[userId] = true;
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('OK');
            } else {
                paymentSuccessStates[userId] = false;
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('NOK');
            }
        } else if (parsedUrl.pathname === '/check-payment') {
            const userId = queryParams.userId;
            const isSuccess = paymentSuccessStates[userId];

            if (isSuccess) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false }));
            }
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Service Running');
        }
    } catch (error) {
        console.error("Server error:", error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});
