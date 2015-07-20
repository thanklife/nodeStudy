var Product_info = require('./product_info.js');
var product_info;
var selectSQL;
var orderByKey = require('./orderByKey.js');
var orderStrModule;

module.exports = function () {
    __constructor();
    
    this.getProductListByCorpId = function (corpId, orderJson, callback) {        

        if (corpId.length > 0) {
            selectSQL = selectSQL.replace(';', " ");
            selectSQL += "and corpId = \'" + corpId + "\';";
        }
        
        orderStrModule = orderByKey.getOrderStr(orderJson);
        if (orderStrModule.length > 0) {
            selectSQL = selectSQL.replace(';', " ");
            selectSQL += orderStrModule + ";";
        }        

        product_info.getProductListByCorpId(selectSQL, orderJson, corpId, callback);
    };
    
    function __constructor() {
        product_info = new Product_info();
        selectSQL = "SELECT * FROM qiv.product p JOIN qiv.product_model m where p.productId = m.productId;";
    };
}

