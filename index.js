const http = require('http');
const url = require('url');
const querystring = require('querystring');
const Paymentwall = require('paymentwall');

const APP_KEY = '769e42c1ad1be421ccad03967b4ca865';
const SECRET_KEY = 'f691e3ccf8713ee0f248bf914ff7f7a0';

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

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
