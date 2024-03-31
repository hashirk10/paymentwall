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
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    
    // Dedicated endpoint for handling Paymentwall pingbacks
    if (parsedUrl.pathname === '/pingback') {
        const isValidPingback = true; // Implement actual validation logic here
        const userId = queryParams['userId']; // Adjust based on how userId is passed in the pingback
        
        if (isValidPingback) {
            paymentSuccessStates[userId] = true;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('NOK');
        }
    } 
    // Endpoint for clients to check payment status
    else if (parsedUrl.pathname === '/check-payment') {
        const userId = queryParams['userId'];
        
        if (paymentSuccessStates[userId]) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
        }
    } 
    // Fallback for any other access, indicating the service is running
    else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Service Running');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
