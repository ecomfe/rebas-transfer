/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

var handlers = {};

function add(type, handler) {
    handlers[type] = handler;
}

add('route', require('./lib/route'));
add('tpl', require('./lib/tpl'));

module.exports = function (type, file) {
    var handler = handlers[type];
    if (!handler) {
        return;
    }

    return handler(file);
};

module.exports.edpWebserver = require('./lib/adapter/edp-webserver');
