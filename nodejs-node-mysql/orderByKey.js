//获取关键字的排序字符串
function getPaiXuBykey(paiXuJson, keystr) {
    var paiXuStr = '';
    switch (paiXuJson[keystr]) {
        case 0:
            break;
        case 1:
            paiXuStr = " " + keystr;
            break;
        case 2:
            paiXuStr = " " + keystr + " DESC";
            break;
        default:
            break
    }
    return paiXuStr;
}

//链接排序字符串
function linkOrderStrByKey(orderStr, paiXu, keyString) {
    var keyStringSeg = getPaiXuBykey(paiXu, keyString);
    if (keyStringSeg.length > 0) {
        if (orderStr.length > 0) {
            orderStr = orderStr + ", ";
        }
        orderStr = orderStr + " " + keyStringSeg;
    }
    return orderStr;
}

exports.getOrderStr = function (paiXu) {
    var orderStr = '';    
    orderStr = linkOrderStrByKey(orderStr, paiXu, 'p.createtime');
    orderStr = linkOrderStrByKey(orderStr, paiXu, 'm.sales');
    orderStr = linkOrderStrByKey(orderStr, paiXu, 'm.stock');
    
    if (orderStr.length > 0) {
        orderStr = " ORDER BY " + orderStr;
    }
    return orderStr
}

