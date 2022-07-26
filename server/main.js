const routes = require('./routes');
const urlParser = require('url');

const server = require('http').createServer((req, res) => {
    const url = urlParser.parse(req.url, true);
    if (!(url.pathname in routes)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }
    if (!(req.method in routes[url.pathname])) {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
        return;
    }
    req.params = url.query;
    routes[url.pathname][req.method](req, res);
});

server.listen(process.env.PORT);