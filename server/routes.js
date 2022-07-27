const handlers = require('./handlers.js');

const routes = {
    '/': {
        'GET': handlers.home,
    },
    '/about': {
        'GET': handlers.about
    },
    '/contact': {
        'GET': handlers.contact
    },
    '/file': {
        'GET': handlers.file,
        'POST': handlers.file,
        'PATCH': handlers.file,
        'DELETE': handlers.file
    }
};

module.exports = routes;