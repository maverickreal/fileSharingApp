const handlers = require('./handlers.js');

const routes = {
    '/': {
        'GET': handlers.homeHandler,
    },
    '/file': {
        'GET': handlers.fileHandler,
        'POST': handlers.fileHandler,
    }
};

module.exports = routes;