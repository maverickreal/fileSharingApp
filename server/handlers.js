const db = require('../db/db.js'),
    busboy = require('busboy'),
    fs = require('fs'),
    zlib = require('zlib'),
    mailer = require('./services/email.js');
// --------- request senders -------------------------
const failure = (res) => {
    res.writeHead(400, { Connection: 'close', Location: '/', 'Content-Type': 'text/plain' });
    res.end('Bad Request');
}

const exception = (res) => {
    res.writeHead(500, { Connection: 'close', Location: '/', 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
}
//-----------------------------------------------------

// -------------handlers-------------------------------
const homeHandler = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/HTML' });
    res.end(fs.readFileSync('client/home.html'));
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
            res.writeHead(200, { Connection: 'close', Location: '/', 'Content-Type': 'application/octet-stream', 'Content-Disposition': 'attachment; filename=' + data.filename, 'Content-Encoding': 'gzip' });

            data.file.on('data', chunk => {
                res.write(chunk);
            });

            data.file.on('end', () => {
                data.file.pipe(zlib.createGzip()).pipe(res);
                res.end();
            });
        }
    });
}

const setFile = (upload, res) => {
    db.setItem(upload, status => {
        if (status === 'error') {
            exception(res);
        }
        else if (status === 'not found') {
            failure(res);
        }
        else {
            mailer.sendMail(upload.senderemail, upload.receiveremail, `<a>localhost:3000/file?id=${status}</a>`);
            res.writeHead(200, { Connection: 'close', Location: '/', 'Content-Type': 'text/plain' });
            res.end('OK');
        }
    });
}

const fileHandler = (req, res) => {
    if (req.method === 'GET') {
        if (!(req.params && req.params.id)) {
            failure(res);
        }
        else {
            getFile(req, res);
        }
    }
    else { // post
        const bb = busboy({ headers: req.headers });
        const upload = { data: [], filename: '' };
        bb.on('file', (fieldname, file, info) => {
            upload.filename = info.filename;
            file.on('data', chunk => {
                upload.data.push(chunk);
            });
        });
        bb.on('field', (fieldname, value) => {
            upload[`${fieldname}`] = value;
        });
        bb.on('finish', () => {
            upload.data = Buffer.concat(upload.data);
            setFile(upload, res);
        });
        req.pipe(bb);
    }
}

module.exports = {
    homeHandler,
    fileHandler
};