/**
 * @file 将路由信息转化为AMD封装的模块
 * @author treelite(c.xinle@gmail.com)
 */

var indent = require('../util/indent');

/**
 * 转化路由信息
 * 主要是对其中的action字段进行处理
 *
 * @public
 * @param {string} data
 * @return {string}
 */
module.exports = function (data) {
    data = JSON.parse(data);
    data.forEach(function (item) {
        if (!item.async) {
            item.action = '--' + item.action + '--';
        }
    });

    var content = JSON.stringify(data, null, 4)
        .replace(/"--([^-]+)--"/g, function ($0, $1) {
            return 'require("' + $1 + '")';
        });

    return 'define(function (require) {\n'
        + indent('return ' + content + ';', 4)
        + '\n});';
};
