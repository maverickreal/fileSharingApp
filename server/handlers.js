const db = require('../db/db.js');

// --------- request senders -------------------------
const failure = (res) => {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}

const success = (res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('OK');
}

const exception = (res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error');
}
//-----------------------------------------------------

// -------------handlers-------------------------------
const home = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Home');
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
    db.updateItem(req.params.id, req.params.file, status => {
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
    db.setItem(req.params.file, status => {
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
    if (!req.params) {
        return failure(res);
    }
    if (req.method === 'GET') {
        if (!req.params.id) {
            failure(res);
        }
        else {
            getFile(req, res);
        }
        return;
    }
    if (req.method === 'DELETE') {
        if (!req.params.id) {
            failure(res);
        }
        else {
            deleteFile(req, res);
        }
        return;
    }
    if (req.method === 'PATCH') {
        if (!req.params.file) {
            failure(res);
        }
        else {
            updateFile(req, res);
        }
        return;
    }
    if (req.method === 'POST') {
        if (!req.params.file) {
            failure(res);
        }
        else {
            setFile(req, res);
        }
        return;
    }
}

module.exports = {
    home,
    about,
    contact,
    file
};