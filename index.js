const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Mock Paymentwall configuration for demonstration purposes
const Paymentwall = {
    Configure: function(apiType, appKey, secretKey) {
        // Placeholder for Paymentwall configuration logic
    },
    Base: {
        API_GOODS: 'API_GOODS' // Placeholder
    }
};

// Replace these with your actual Paymentwall project keys
Paymentwall.Configure(
  Paymentwall.Base.API_GOODS,
  '769e42c1ad1be421ccad03967b4ca865',
  'f691e3ccf8713ee0f248bf914ff7f7a0'
);

require('dotenv').config();

let isValidPingbackReceived = {};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const queryParams = parsedUrl.query;
    
    // Handling Paymentwall pingbacks
    if (parsedUrl.pathname === '/pingback') {
        // Example: Validate pingback here according to Paymentwall's guidelines
        const userId = queryParams['userId']; // Adjust according to how userId is received
        const isValidPingback = true; // Placeholder for actual validation logic

        isValidPingbackReceived[userId] = isValidPingback;

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK'); // Respond with 'OK' to acknowledge receipt of the pingback
    }
    // Endpoint for clients (Unity) to check payment status
    else if (parsedUrl.pathname === '/check-payment') {
        const userId = queryParams['userId'];

        if (isValidPingbackReceived.hasOwnProperty(userId) && isValidPingbackReceived[userId]) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
        }
    } 
    else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Service Running');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
