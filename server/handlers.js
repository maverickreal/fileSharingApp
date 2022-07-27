const db = require('../db/db.js');
const busboy = require('busboy');
const fs = require('fs');

// --------- request senders -------------------------
const failure = (res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(400, { Connection: 'close', Location: '/' });
    res.end('Bad Request');
}

const success = (res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(200, { Connection: 'close', Location: '/' });
    res.end('OK');
}

const exception = (res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(500, { Connection: 'close', Location: '/' });
    res.end('Internal Server Error');
}
//-----------------------------------------------------

// -------------handlers-------------------------------
const home = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync('client/home.html'));
}

const about = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('About');
}

const contact = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Contact');
}

const getFile = (req, res) => {
    db.getItem(req.params.id, (status, data) => {
        if (status === 'not found') {
            failure(res);
        }
        else if (status === 'error') {
            exception(res);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(data);
        }
    });
}

const deleteFile = (req, res) => {
    db.deleteItem(req.params.id, status => {
        if (status === 'error') {
            exception(res);
        }
        else if (status === 'not found') {
            failure(res);
        }
        else {
            success(res);
        }
    });
}

const updateFile = (req, res) => {
    db.updateItem(req.upload, req.params.file, status => {
        if (status === 'error') {
            exception(res);
        }
        else if (status === 'not found') {
            failure(res);
        }
        else {
            success(res);
        }
    });
}

const setFile = (req, res) => {
    db.setItem(req.upload, status => {
        if (status === 'error') {
            exception(res);
        }
        else if (status === 'not found') {
            failure(res);
        }
        else {
            success(res);
        }
    });
}

const file = (req, res) => {
    if (req.method === 'GET') {
        if (!(req.params && req.params.id)) {
            failure(res);
        }
        else {
            getFile(req, res);
        }
        return;
    }
    if (req.method === 'DELETE') {
        if (!(req.params && req.params.id)) {
            failure(res);
        }
        else {
            deleteFile(req, res);
        }
        return;
    }
    if (req.method === 'PATCH') {
        busboy({ headers: req.headers }).on('file', (name, file) => {
            file.on('data', data => {
                req.upload = data;
            });
        });
        if (!req.upload) {
            failure(res);
        }
        else {
            updateFile(req, res);
        }
        return;
    }
    if (req.method === 'POST') {
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
            file.on('data', data => {
                if (!data) {
                    failure(res);
                }
                else {
                    req.upload = { name, data, info };
                    setFile(req, res);
                }
            });
        });
        req.pipe(bb);
    }
}

module.exports = {
    home,
    about,
    contact,
    file
};