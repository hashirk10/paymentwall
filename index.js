const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Paymentwall = require('paymentwall');

// Initialize Paymentwall with your project keys
Paymentwall.Base.setApiType(Paymentwall.Base.API_GOODS);
Paymentwall.Base.setAppKey('YOUR_APP_KEY'); // Replace with actual app key
Paymentwall.Base.setSecretKey('YOUR_SECRET_KEY'); // Replace with actual secret key

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

        if (queryParams.notification_type && queryParams.notification_type === 'pingback') {
            const pingback = new Paymentwall.Pingback(queryParams, req.connection.remoteAddress);
            pingback.validate((error, isValid) => {
                if (isValid) {
                    console.log("Payment validated");
                    paymentSuccessStates[queryParams.userId] = true;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('OK');
                } else {
                    console.error("Pingback validation failed", error);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Validation Failed');
                }
            });
        } else if (parsedUrl.pathname === '/check-payment') {
            const userId = queryParams.userId;
            if (paymentSuccessStates[userId]) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ success: true }));
                delete paymentSuccessStates[userId];
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ success: false }));
            }
        } else {
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
