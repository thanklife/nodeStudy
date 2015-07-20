//var productList = require('./getProductListWhereProductJoinModel.js');
var ProductClass = require('./productClass.js');

//参数说明0，不启用，1，正序，2，倒叙；
var productOrderByJson = {
    "p.createtime": 2,
    "m.sales": 0,
    "m.stock": 0
};
var corpId = "865960149000008";

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

var productClass = new ProductClass();
productClass.getProductListByCorpId(corpId, productOrderByJson, callbackLog);

