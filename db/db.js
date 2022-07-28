const path = require('path'),
    fs = require('fs'),
    zlib = require('zlib'),
    { Readable } = require('stream');


const db = require('mysql').createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error(err);
    }
});

const getItem = (id, cb) => {
    try {
        db.query(`SELECT FILE, FILENAME FROM FILES WHERE ID = ${id} LIMIT 1 ;`, (err, ret) => {
            if (err) {
                cb('error', null);
            }
            else if (ret.length === 0) {
                cb('not found', null);
            }
            else {
                cb('success', { filename: ret[0].FILENAME, file: fs.createReadStream(path.join(__dirname, ret[0].FILE)) });
            }
        });
    }
    catch (err) {
        console.error(err);
        cb('error', null);
    }
}

const setItem = (file, cb) => {
    try {
        const time = new Date().getTime(),
            rs = Readable.from(file.data),
            fileLoc = '../store/' + time + '_' + file.filename + '.gz',
            ws = fs.createWriteStream(path.join(__dirname, fileLoc));

        rs.pipe(zlib.createGzip()).pipe(ws);
        ws.on('finish', () => {
            db.query(`INSERT INTO FILES (FILE, FILENAME) VALUES ('${fileLoc}', '${file.filename}') ;`, (err, ret) => {
                if (err) {
                    console.error(err);
                    cb('error', null);
                }
                else if (ret.length === 0) {
                    cb('not found');
                }
                else {
                    cb('success');
                }
            });
        });
    }
    catch (err) {
        console.error(err);
        cb('error');
    }
}

module.exports = {
    getItem,
    setItem
}