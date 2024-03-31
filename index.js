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
let paymentSuccessStates = {}; // In-memory storage for demo purposes

const server = http.createServer((req, res) => {
    try {
        // Basic CORS setup; adjust as necessary
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        const parsedUrl = url.parse(req.url, true); // `true` to parse query string
        const queryParams = parsedUrl.query;

        // Handling pingback for payment validation
        if (parsedUrl.pathname === '/pingback') {
            // Insert your logic to validate pingback with Paymentwall
            // This is a placeholder logic, adjust according to actual Paymentwall pingback documentation
            if (queryParams.notification_type === 'pingback') {
                const userId = queryParams.uid; // Ensure correct parameter name as per Paymentwall documentation
                paymentSuccessStates[userId] = true; // Simulate successful payment validation
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('OK');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('NOK');
            }
        }
        // Check payment status
        else if (parsedUrl.pathname === '/check-payment') {
            const userId = queryParams.userId;
            const isSuccess = paymentSuccessStates[userId] || false;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: isSuccess }));
        } else {
            // Default response for any other request
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('OK');
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
