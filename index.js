const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Paymentwall = require('paymentwall');

// Initialize Paymentwall with your project keys
Paymentwall.Base.setApiType(Paymentwall.Base.API_GOODS);
Paymentwall.Base.setAppKey('769e42c1ad1be421ccad03967b4ca865'); // Replace with your actual app key
Paymentwall.Base.setSecretKey('f691e3ccf8713ee0f248bf914ff7f7a0'); // Replace with your actual secret key

require('dotenv').config();

// Simulated storage for payment success state
let paymentSuccessStates = {};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);

    // Check if it's a notification from Paymentwall (pingback)
    if (queryParams.notification_type === 'pingback') {
        const pingback = new Paymentwall.Pingback(queryParams, req.connection.remoteAddress);
        pingback.validate((error, isValid) => {
            if (isValid) {
                console.log("Payment validated");
                // Store success state
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
        // Endpoint for Unity to check payment success
        const userId = queryParams.userId;
        if (paymentSuccessStates[userId]) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: true }));
            // Optionally reset the state
            delete paymentSuccessStates[userId];
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ success: false }));
        }
    } else {
        // Handle other requests
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Ok');
    }
});

// Use PORT provided in the environment or default to 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
