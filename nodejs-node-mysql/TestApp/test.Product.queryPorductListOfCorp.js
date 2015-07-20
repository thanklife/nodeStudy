var mysqldal = require('../mysqldal');
var product = mysqldal.product;

//****************构造测试条件 start ********************
//参数说明0，不启用，1，正序，2，倒叙；
var productOrderByJson = {
    "p.createtime": 2,
    "m.sales": 0,
    "m.stock": 0
};
var corpId = "865960149000008";

function showProductList(err, obj) {
    if (err) {
        console.log("===> ERROR:    " + err);
    }
    else {
        console.log("********showProductList************");
        for (var i in obj) {
            console.log(obj[i]);
        }
    }
}

//****************构造测试条件 end ********************
product.queryPorductListOfCorp(corpId, productOrderByJson, showProductList);