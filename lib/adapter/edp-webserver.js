/**
 * @file edp-webserver处理器
 * @author treelite(c.xinle@gmail.com)
 */

var extend = require('../util/extend');

var defaultOptions = {
    template: {
        mode: 'format',
        wrap: true
    }
};

/**
 * edp-webserver处理器
 *
 * @public
 * @param {string} type 类型
 * @param {Object=} options 选项
 * @return {Function}
 */
module.exports = function (type, options) {
    options = options || {};
    return function (context) {
        var fs = require('fs');
        var transfer = require('../../index');
        var docRoot  = context.conf.documentRoot;
        var pathname = context.request.pathname;
        var file = docRoot + pathname.replace(/\.js$/, '');

        var opts = extend({}, defaultOptions[type] || {});
        if (fs.existsSync(file)) {
            var encoding = options.encoding || 'utf8';
            var data = fs.readFileSync(file, encoding);
            context.content = transfer(type, data, extend(opts, options || {}));
            context.start();
        }
        else {
            context.status = 404;
            context.start();
        }
    };
};
