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
    const parsedUrl = url.parse(req.url, true); // true to parse query params
    const queryParams = parsedUrl.query;
    
    if (parsedUrl.pathname === '/pingback') {
        // Assume pingback validation happens here
        paymentAcknowledged = true; // Acknowledge any valid pingback
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK'); // Respond to Paymentwall pingback
    } else if (parsedUrl.pathname === '/check-payment') {
        // The response is solely based on whether any pingback was acknowledged
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: paymentAcknowledged }));
    } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Service Running');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
