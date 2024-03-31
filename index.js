const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Paymentwall = require('paymentwall');

// Configure Paymentwall with your project keys
Paymentwall.Configure(
  Paymentwall.Base.API_GOODS,
  '769e42c1ad1be421ccad03967b4ca865', // Replace with your actual app key
  'f691e3ccf8713ee0f248bf914ff7f7a0'  // Replace with your actual secret key
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

        if (queryParams.notification_type && queryParams.notification_type === 'pingback') {
            const pingback = new Paymentwall.Pingback(queryParams, req.connection.remoteAddress);
            if (pingback.validate()) {
                const productId = pingback.getProduct().getId();
                if (pingback.isDeliverable()) {
                    // deliver the product
                    paymentSuccessStates[queryParams.userId] = true;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('OK');
                } else if (pingback.isCancelable()) {
                    // withdraw the product
                    paymentSuccessStates[queryParams.userId] = false;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('OK');
                }
            } else {
                console.log(pingback.getErrorSummary());
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('NOK');
            }
        } else if (parsedUrl.pathname === '/check-payment') {
            const userId = queryParams.userId;
            const paymentSuccess = paymentSuccessStates[userId];
            if (paymentSuccess) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ success: false }));
            }
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
});
