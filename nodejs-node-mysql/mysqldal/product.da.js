/*
 * 商品相关处理
 */
var async = require('async');
var conn = require('./dbinfo').conn;
var pool = require('./dbinfo').pool;
var orderByKey = require('./orderByKey.js');

var tProduct = "product";
var tModel = "product_model";
var vProductModel = "product_model_view";
var tOrder = "product_order";

/*
 productId      bigint          商品id，自增长
 corpId         varchar(21)     企业id
 userId         bigint	        用户id
 name           varchar(64)	    商品名称
 intro          varchar(1024)	简介
 cover          text            商品的图片url，可以有多张。格式为字符串数组
 score          float	        评分的平均分
 extend         text            扩展信息，keyvalue格式的对象数组的json字符串。
 detail         text            产品详细信息，json格式，类似宣传单格式的文本
 validdate      varchar(10)     有效期，形如2015-10-10
 state          int             0正常，1下架
 createtime     bigint          创建时间
 timestamp      bigint          时间戳
 */
module.exports = {
    queryPorductListOfCorp: function (corpId, productOrderByJson, callback) {
        var selectSQL;
        selectSQL = "SELECT * FROM qiv.product p JOIN qiv.product_model m where p.productId = m.productId;";
        if (corpId.length > 0) {
            selectSQL = selectSQL.replace(';', " ");
            selectSQL += "and corpId = \'" + corpId + "\';";
        }
        
        var orderStrModule = orderByKey.getOrderStr(productOrderByJson);
        if (orderStrModule.length > 0) {
            selectSQL = selectSQL.replace(';', " ");
            selectSQL += orderStrModule + ";";
        }        
        query(selectSQL, callback);
    },
    
    evaluateProduct: function (){
    },
    //以下还没有完成。
    createProductOrder: function (productId, amount, callback){
        pool.getConnection(function (err, connection) {
            if (err) {
                typeof callback == "function" && callback(err, result);
                return;
            }
            async.auto({
                begin: function (callback) {
                    connection.beginTransaction(callback);
                },
                haveStock: ['begin', function (callback, results){
                        var sql = "SELECT stock FROM ?? WHERE productId = ? ";
                        var val = [tProductModel, productId];
                        connection.query(sql, val, function (err, result) {
                            if (err) {
                                typeof callback == "function" && callback(err, result);
                                return;
                            }
                            if (result[0] < 0) {
                                typeof callback == "function" && callback('库存不足', result);
                                return;
                            }
                            typeof callback == "function" && callback(err, result);  
                        });
                    }
                ],
                outOfDate: ['begin', function (callback, results) {
                        var sql = "SELECT COUNT(productId) count FROM ?? WHERE productId = ? AND STR_TO_DATE(validdate, '%Y-%m-%d') >= CURDATE()";
                        var val = [tProduct, productId, new Date];
                        connection.query(sql, val, function (err, result) {
                            if (err) {
                                typeof callback == "function" && callback(err, result);
                                return;
                            }
                            if (result[0] < 0) {
                                typeof callback == "function" && callback('outOfDate', result);
                                return;
                            }
                            typeof callback == "function" && callback(err, result);
                        });
                    }
                ],
                offShelves: ['begin', function (callback){
                        var sql = "SELECT  COUNT(productId) count FROM ?? WHERE productId = ? AND state = 0";
                        var val = [tProductModel, productId];
                        connection.query(sql, val, function (err, result) {
                            if (err) {
                                typeof callback == "function" && callback(err, result);
                                return;
                            }
                            if (result[0] < 0) {
                                typeof callback == "function" && callback('offShelves', result);
                                return;
                            }
                            typeof callback == "function" && callback(err, result);
                        });
                    }
                ],
                createOrder: function (corpId, condition, isValid/*0：不过期且未下架， 1：全部*/, callback) {
                    var doc = {
                        corpId: corpId,
                        name: data.name,
                        intro: data.intro ? data.intro : '',
                        cover: JSON.stringify(data.cover),
                        extend: '[]',
                        detail: data.detail ? JSON.stringify(data.detail) : '[]',
                        validdate: data.validdate ? data.validdate : '0',
                        timestamp: Date.now()
                    };
                    data.timestamp = doc.timestamp;
                    var sql = "insert  COUNT(productId) count FROM ?? WHERE corpId = ? " + dealCondition(condition, conn);
                    if (isValid == 0) {
                        sql += " AND STR_TO_DATE(validdate, '%Y-%m-%d') >= CURDATE() AND state = 0";
                    }
                    var val = [vProductModel + '2', corpId];
                    conn.query(sql, val, function (err, result) {
                        typeof callback == "function" && callback(err, result);
                    });
                },

                commit: ['deleteProduct', 'deleteProCategoryRelations', function (callback, results) {
                        connection.commit(callback);
                    }]
            }, function (err, result) {
                if (!err) {
                    connection.release();
                    callback(null, results.select);
                }
                else {
                    connection.rollback(function () {
                        connection.release();
                        callback(err);
                    });
                }
            }
            );
        });		 
    },

    deleteProduct: function (corpId, productId, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(err);
            }
            else {
                async.auto({
                    begin: function (callback) {
                        connection.beginTransaction(callback);
                    },
                    deleteProduct: ['begin', function (callback, results) {
                            var sql = "UPDATE ?? SET ? WHERE productId = ? AND corpId = ?";
                            var val = { state: 2/*删除*/, timestamp: Date.now() };
                            connection.query(sql, [tProduct, val, productId, corpId], function (err, result) {
                                typeof callback == "function" && callback(err, result);
                            });
                        }],
                    deleteProCategoryRelations: ['begin', function (callback, results) {
                            var val = { state: 1/*删除*/, timestamp: Date.now() };
                            var sql = "UPDATE ?? SET ? WHERE productId = ?";
                            connection.query(sql, [tProductCategoryRelation, val, productId], function (err, result) {
                                callback(err, result);
                            });
                        }],
                    commit: ['deleteProduct', 'deleteProCategoryRelations', function (callback, results) {
                            connection.commit(callback);
                        }]
                }, function (err, result) {
                    if (!err) {
                        connection.release();
                        callback(null);
                    }
                    else {
                        connection.rollback(function () {
                            connection.release();
                            callback(err);
                        });
                    }
                });
            }
        });
    },
};

function query(selectSQL, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            typeof callback == "function" && callback(err, null);
        }
        conn.query(selectSQL, function (err, result) {
            typeof callback == "function" && callback(err, result);
        });
    });
};
 