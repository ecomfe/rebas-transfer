/**
 * @file 将路由信息转化为AMD封装的模块
 * @author treelite(c.xinle@gmail.com)
 */

var indent = require('./util/indent');

/**
 * 转化路由信息
 *
 * @public
 * @param {Object} data
 * @return {string}
 */
module.exports = function (data) {
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
        + indent(content, 4)
        + '\n});';
};
