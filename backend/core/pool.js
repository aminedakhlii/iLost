const util = require('util');
const mysql = require('mysql2');


const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'emino',
    database: 'lostfound'
});

pool.getConnection((err, connection) => {
    if(err)
        console.error(err);

    if(connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
