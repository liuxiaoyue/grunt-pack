/** 
 * @fileoverview 获取nodeName为指定标签名的父元素
 * @author Book | liming9@staff.sina.com.cn
 * @create 2012-08-11
 * @forcopy $import("sina/core/dom/parent.js");
 */
$import("sina/core/dom/_dom.js");

/**
 * 从源节点开始获取nodeName为指定标签名的父元素，查找不到时返回null
 * @method
 * @param {HTMLElement} node 源节点
 * @param {String} nodeName 指定的元素标签名
 * @type HTMLElement
 */
Core.Dom.parentByClass = function (node, className) {
	// 文档节点没有tagName, 因此不能使用tagName
	className = ' '+className+' ';
	while(node){
		if(node.className && (' '+node.className+' ').indexOf(className)>-1){
			return node;
		}
		node = node.parentNode;
	}
	return null;
};
