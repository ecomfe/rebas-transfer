/**
 * @file 模版处理
 * @author treelite(c.xinle@gmail.com)
 */

var html2js = require('html2js');

/**
 * 模版转换
 *
 * @public
 * @param {string} data 模版数据
 * @param {Object} options 参数
 * @return {string}
 */
module.exports = function (data, options) {
    return html2js(data, options);
};
