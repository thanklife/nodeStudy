var pool = require('./dbinfo.js').pool;
var selectSQL = 'select * from product limit 10';
var dbClient;

module.exports = function () {
    __constructor();
    
    this.getProductListByCorpId = function (selectSQL, paiXu, corpId, callback) {
        pool.getConnection(function (err, conn) {
            if (err)
                console.log(err);
            conn.query(selectSQL, function (err, rows) {
                if (err)
                    console.log(err);
                callback(err, rows);
            });
        });
    };
    
    function __constructor() {
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log("POOL ==> " + err);
            }
            else {
                dbClient = conn;
                conn.query(selectSQL, function (err, rows) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("********__constructor sucess!*********** ");
                    for (var i in rows) {
                        //console.log(rows[i]);
                    }
                    conn.release();
                });
            }
        });
    }
}