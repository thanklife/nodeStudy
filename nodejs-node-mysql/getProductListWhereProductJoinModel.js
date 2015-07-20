var Product_info = require('./product_info.js');
var product_info = new Product_info();

function callbackLog(err, obj) {
    if (err) {
        console.log("===> ERROR:    " + err);
    }
    else {
        console.log("********callbackLog************");
        for (var i in obj) {
            console.log(obj[i]);
        }
    }
}
//参数说明0，不启用，1，正序，2，倒叙；
var paiXuJson = {
    "p.createtime": 2,
    "m.sales": 0,
    "m.stock": 0
};

var corpId = "865960149000008";
var orderByKey = require('./orderByKey.js');
var orderStrModule = orderByKey.getOrderStr(paiXuJson);

var selectSQL = "SELECT * FROM qiv.product p JOIN qiv.product_model m where p.productId = m.productId;";

if (corpId.length > 0) {
    selectSQL = selectSQL.replace(';', " ");
    selectSQL += "and corpId = \'" + corpId + "\';";
}

if (orderStrModule.length > 0) {
    selectSQL = selectSQL.replace(';', " ");
    selectSQL += orderStrModule + ";";
}

product_info.getProductListByCorpId(selectSQL, paiXuJson, corpId, callbackLog);
