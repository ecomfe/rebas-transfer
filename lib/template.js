/**
 * @file 模版处理
 * @author treelite(c.xinle@gmail.com)
 */

var html2js = require('html2js');

module.exports = function (data, options) {
    return html2js(data, options);
};
