const http = require('http');
const url = require('url');
const querystring = require('querystring');
var Paymentwall = require('paymentwall');

// Initialize Paymentwall with your project keys
Paymentwall.Configure(
    Paymentwall.Base.API_GOODS,
    '769e42c1ad1be421ccad03967b4ca865',
    'f691e3ccf8713ee0f248bf914ff7f7a0'
);

require('dotenv').config();

let paymentSuccessStates = {};

const server = http.createServer((req, res) => {
    try {
        // Set CORS headers
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

        // Handling for specific paths
        if (queryParams.notification_type && queryParams.notification_type === 'pingback') {
            // Existing pingback handling logic
        } else if (parsedUrl.pathname === '/check-payment') {
            // Existing /check-payment handling logic
        } else {
            // Default response for any other request
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Ok');
        }
    } catch (error) {
        console.error("Server error:", error);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});

// Global uncaught exception handler
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Optionally, perform cleanup or restart actions here
});
