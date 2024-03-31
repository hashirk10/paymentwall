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

// Ensure this part correctly updates the user's payment status
if (isValidPingback) {
    paymentSuccessStates[userId] = true;
    console.log(`Payment success for userId: ${userId}`); // Logging for debugging
} else {
    console.log(`Invalid pingback for userId: ${userId}`); // Logging for debugging
}


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const queryParams = parsedUrl.query;
    
    if (parsedUrl.pathname === '/pingback') {
        // Validate pingback here and set validity
        const userId = queryParams['userId'];
        isValidPingbackReceived[userId] = true; // Assume validation passes for demo
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    } else if (parsedUrl.pathname === '/check-payment') {
        const userId = queryParams['userId'];
        const isValidPingback = isValidPingbackReceived[userId];
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: !!isValidPingback }));
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Service Running');
    }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
