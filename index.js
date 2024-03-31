const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Paymentwall = require('paymentwall');

// Assume Paymentwall is correctly initialized as per their documentation
Paymentwall.Configure(
  Paymentwall.Base.API_GOODS,
  '769e42c1ad1be421ccad03967b4ca865', // Your actual Paymentwall App Key
  'f691e3ccf8713ee0f248bf914ff7f7a0'  // Your actual Paymentwall Secret Key
);

require('dotenv').config();

let paymentSuccessStates = {};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true); // True to parse the query as well
    const queryParams = parsedUrl.query;
    
    if (parsedUrl.pathname === '/pingback') {
        // Simulate pingback validation logic
        const isValidPingback = true; // Placeholder; replace with actual validation logic
        const userId = queryParams['userId']; // Extract userId from pingback data

        // Update payment status based on pingback validation
        paymentSuccessStates[userId] = isValidPingback;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK'); // Acknowledge the pingback
    } 
    else if (parsedUrl.pathname === '/check-payment') {
        const userId = queryParams['userId'];
        
        // Check payment status based on pingback validation
        const isPaymentSuccessful = paymentSuccessStates.hasOwnProperty(userId) && paymentSuccessStates[userId];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: isPaymentSuccessful }));
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
