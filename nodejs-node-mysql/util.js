var fs = require('fs')
  , sys = require('util');
exports.get = function (fileName, key) {
    var configJson = {};
    try {
        var str = fs.readFileSync(fileName, 'utf8');
        configJson = JSON.parse(str);//解析出错，不知道什么原因。
    } catch (e) {
        sys.debug("JSON parse fails")
    }
    return configJson[key];
}