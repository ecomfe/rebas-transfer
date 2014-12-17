/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

var handlers = {};

function add(type, handler) {
    handlers[type] = handler;
}

add('json/route', require('./lib/json/route'));
add('json/tpl', require('./lib/json/tpl'));
add('template', require('./lib/template'));

module.exports = function (type, data, options) {
    var handler = handlers[type];
    if (!handler) {
        return;
    }

    return handler(data, options);
};

module.exports.edpWebserver = require('./lib/adapter/edp-webserver');
module.exports.edpBuild = require('./lib/adapter/edp-build');
