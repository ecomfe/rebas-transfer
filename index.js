/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 处理器集合
 *
 * @type {Object}
 */
var handlers = {};

/**
 * 添加处理器
 *
 * @inner
 * @param {string} type 类型
 * @param {function} handler 处理器
 */
function add(type, handler) {
    handlers[type] = handler;
}

// 添加处理器
add('json/route', require('./lib/json/route'));
add('json/tpl', require('./lib/json/tpl'));
add('template', require('./lib/template'));

/**
 * 转化代码
 *
 * @public
 * @param {string} type
 * @param {string} data
 * @param {string} options
 * @return {string}
 */
module.exports = function (type, data, options) {
    var handler = handlers[type];
    if (!handler) {
        return;
    }

    return handler(data, options);
};

// 导出edp-webserver与edp-build的适配器
module.exports.edpWebserver = require('./lib/adapter/edp-webserver');
module.exports.edpBuild = require('./lib/adapter/edp-build');
