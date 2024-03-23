const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Paymentwall = require('paymentwall');
require('dotenv').config()

const APP_KEY = process.env.APP_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

console.log(APP_KEY)


const server = http.createServer((req, res) => {
    console.log("request received")
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    console.log(queryParams)
    // Handle Paymentwall callback
    // const pingback = new Paymentwall.Pingback(queryParams, req.connection.remoteAddress);
    // pingback.validate((error, isValid) => {
    //     console.log("Validating ping")
    //     if (error) {
    //         // Error handling
    //         console.error('Error processing pingback:', error);
    //         res.writeHead(400, {'Content-Type': 'text/plain'});
    //         res.end('Error processing pingback: ' + error.message);
    //     } else if (isValid) {
    //         res.writeHead(200, {'Content-Type': 'text/plain'});
    //         res.end('OK');
    //     } else {
    //         res.writeHead(400, {'Content-Type': 'text/plain'});
    //         res.end('Invalid pingback');
    //     }
    // });

    res.end('Ok')
});

// const PORT = 3000;
// Use PORT provided in environment or default to 3000
const PORT = process.env.PORT || 3000;

server.listen(PORT,"0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
