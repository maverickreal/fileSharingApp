const db = require('mysql').createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.log('error1 : ' + err);
    }
});

const getItem = (id, cb) => {
    try {
        db.query(`SELECT FILE FROM FILES WHERE ID = ${id} ;`, (err, ret) => {
            if (err) {
                cb('error', null);
            }
            else if (ret.length === 0) {
                cb('not found', null);
            }
            else {
                cb(null, ret[0].FILE);
            }
        });
    }
    catch (error) {
        console.log('error2 : ' + error);
        cb('error', null);
    }
}

const setItem = (file, cb) => {
    try {
        db.query(`INSERT INTO FILES (FILE) VALUES ('${file}') ;`, (err, ret) => {
            if (err) {
                cb('error');
            }
            else if (ret.length === 0) {
                cb('not found');
            }
            else {
                cb('success');
            }
        });
    }
    catch (err) {
        cb('error');
    }
}

const updateItem = (id, file, cb) => {
    try {
        db.query(`SELECT FILE FROM FILES WHERE ID=${id} ;`, (err, ret) => {
            if (err) {
                cb('error');
            }
            else if (ret.length === 0) {
                cb('not found');
            }
            else {
                db.query(`UPDATE FILES SET FILE = '${file}' WHERE ID = ${id} ;`, err => {
                    if (err) {
                        cb('error');
                    }
                    else {
                        cb('success');
                    }
                });
            }
        });
    }
    catch (err) {
        cb('error');
    }
}

const deleteItem = (id, cb) => {
    try {
        db.query(`SELECT FILE FROM FILES WHERE ID=${id} ;`, (err, ret) => {
            if (err) {
                cb('error');
            }
            else if (ret.length === 0) {
                cb('not found');
            }
            else {
                db.query(`DELETE FROM FILES WHERE ID = ${id} ;`, err => {
                    if (err) {
                        cb('error');
                    }
                    else {
                        cb('success');
                    }
                });
            }
        });
    }
    catch (err) {
        cb('error');
    }
}

module.exports = {
    getItem,
    setItem,
    updateItem,
    deleteItem
}