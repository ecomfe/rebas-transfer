/**
 * @file edp-webserver处理器
 * @autor treelite(c.xinle@gmail.com)
 */

/**
 * edp-webserver处理器
 *
 * @public
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

        if (fs.existsSync(file)) {
            var encoding = options.encoding || 'utf8';
            var data = fs.readFileSync(file, encoding);
            context.content = transfer(type, JSON.parse(data));
            context.start();
        }
        else {
            context.status = 404;
            context.start();  
    };
};
