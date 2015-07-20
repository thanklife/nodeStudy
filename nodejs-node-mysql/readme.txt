 /*
 * 2.编写一个逻辑，读取一个商家的产品列表，需要附带model信息
 *   2.1默认排序是以创建时间倒序排
 *   2.2可以根据销量排序，可正序，可倒序
 *   2.3可以根据库存进行排序，可正序可倒序
 */


`orderId`	AUTO_INCREMENT,							
`productId`	COMMENT	'产品id',						
`modelId`	COMMENT	'型号id',						
`corpId`	COMMENT	'企业id',						
`userId`	COMMENT	'扫流量用户id',						
`num`	COMMENT	'购买数量',						
`state`	DEFAULT	'0'	COMMENT	'状态，0已下单，1已发货，2已确认，11退货',				
`createtime`	COMMENT	'创建时间',						
`timestamp`	COMMENT	'时间戳',						
`originPrice`	COMMENT	'购买时的原价(RMB)',						
`specialPrice`	COMMENT	'购买时的优惠价(RMB)',						
`originMcoin`	COMMENT	'购买时的原价(M币)',						
`specialMcoin`	COMMENT	'购买时的优惠价(M币)',						
