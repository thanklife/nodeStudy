var ProductClass = require('./productClass.js');
var productClass = new ProductClass();

exports.createProductOrder = function (productId, score, evaluation, callback) {

};

exports.evaluateProduct = function (productId, amount, callback) {
    
    var querySQL = "select stock from product where product=\'" + productId + "\'";
    productClass.query(querySQL, function (err, rows) {
        if (err) {
            callback(err, null);
            return;
        }
        var stock = rows[0];
        if (stock < 0) {
            callback('订购失败：库存数量不足', null);
            return;
        }
        if (stock < amount) {
            callback('订购失败：您的订购数量超过库存数量'， null);
            return;
        }
        var createSQL = "insert "
        productClass.CreateProductOrder(createSQL, function (err, result) {
            if (err) {
                callback("订购失败：" + err, null);
                return;
            }
            //还需要处理库存的部分的内容。嵌入的较多，先做到这一步？
            callback(err, "订购成功");
        });
    });


};