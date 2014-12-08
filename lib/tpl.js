/**
 * @file transfer tpl profile
 * @author treelite(c.xinle@gmail.com)
 */

var indent = require('./util/indent');

/**
 * 转化模版引擎配置信息
 *
 * @public
 * @param {Object} config
 * @return {string}
 */
module.exports = function (config) {
    var filters = config.filters;

    if (filters) {
        Object.keys(filters).forEach(function (key) {
            filters[key] = '--' + filters[key] + '--';
        });
    }

    var content = JSON.stringify(config, null, 4)
        .replace(/"--([^-]+)--"/g, function ($0, $1) {
            return 'require("' + $1 + '")';
        });

    return 'define(function (require) {\n'
        + indent('return ' + content + ';', 4)
        + '\n});';
};
