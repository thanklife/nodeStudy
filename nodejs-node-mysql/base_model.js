var Util = require('./util')
   , mysql = require('mysql')
   , dbClient;
var dbConfig = {
    //"db" : {
        "host" : "218.206.201.27",
        "port" : "3306",
        "user" : "sa",
        "password" : "AustinSuixinhu",
        "dbName" : "qiv"
   // }
};

module.exports = function () {
    __constructor();
    /**
	 *
	 * @desc 条件查询数据
	 * @param tableName string 
	 * @param whereJson json desc(and和or区别，其中的条件为key值、连接符大于小于还是等于、value值) 
	 * @param orderByJson json desc({'key' : 'time', 'type':'desc'}) 
	 * @param limitArr array desc（第一个元素是返回偏移量，第二个是返回数量，空返回全部）
	 * @param fieldsArr array desc（返回哪些字段）
	 * @param callback function
	 * @return null
	 */
	this.find = function (tableName, whereJson, orderByJson, limitArr, fieldsArr, callback) {
        var andWhere = whereJson['and']
		  , orWhere = whereJson['or']
		  , andArr = []
		  , orArr = [];
        /* 将数组转换为where and条件array */
        for (var i = 0; i < andWhere.length; i++) {
            andArr.push(andWhere[i]['key'] + andWhere[i]['opts'] + andWhere[i]['value']);
        }
        /* 将数组转换为where or条件array */
        for (var i = 0; i < orWhere.length; i++) {
            orArr.push(orWhere[i]['key'] + orWhere[i]['opts'] + orWhere[i]['value']);
        }
        /* 判断条件是否存在，如果存在则转换相应的添加语句 */
        var filedsStr = fieldsArr.length > 0 ? fieldsArr.join(',') : '*'
		  , andStr = andArr.length > 0    ? andArr.join(' and ') : ''
		  , orStr = orArr.length > 0     ? ' or ' + orArr.join(' or ') : ''
		  , limitStr = limitArr.length > 0  ? ' limit ' + limitArr.join(',') : ''
		  , orderStr = orderByJson ? ' order by ' + orderByJson['key'] + ' ' + orderByJson['type'] : '';
        /* 执行mysql语句 */
        dbClient.query('SELECT ' + filedsStr + ' FROM ' + tableName + ' where ' + andStr + orStr + orderStr + limitStr,
            function (error, results) {
            if (error) {
                console.log('GetData Error: ' + error.message);
                dbClient.end();
                callback(false);
            } else {
                callback(results);
            }
        });
    };
    
    /**
	 *
	 * 数据库连接构造函数
	 */
	function __constructor() {
        //var dbConfig = Util.get('config.json', 'db');
        /* 获取mysql配置信息 */
        client = {};
        client.host = dbConfig['host'];
        client.port = dbConfig['port'];
        client.user = dbConfig['user'];
        client.password = dbConfig['password'];
        dbClient = mysql.createConnection(client);
        dbClient.connect();
        /* 执行mysql指令，连接mysql服务器的一个数据库 */
        dbClient.query('USE ' + dbConfig['dbName'], function (error, results) {
            if (error) {
                console.log('ClientConnectionReady Error: ' + error.message);
                dbClient.end();
            }
            console.log('connection local mysql success');
        });
    }
}