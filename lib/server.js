/**
 * @file webserver处理器
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');

/**
 * 默认代码源目录
 *
 * @const
 * @type {string}
 */
var DIR_FORM = 'lib';

/**
 * 默认代码目标目录
 *
 * @const
 * @type {string}
 */
var DIR_TO = 'src';

/**
 * 转化tpl
 *
 * @inner
 * @param {Object} context 执行上下文
 */
function html2js(context) {
    var handler = require('html2js');
    var docRoot  = context.conf.documentRoot;
    var pathname = context.request.pathname;
    var file = docRoot + pathname.replace(/\.js$/, '');
    var data = fs.readFileSync(file, 'utf8');
    context.content = handler(data, {mode: 'format', wrap: true});
}

/**
 * edp-webserver处理器
 *
 * @public
 * @param {Object=} options 配置参数
 * @param {string=} options.from 代码源目录
 * @param {string=} options.to 代码目标目录
 * @return {Function}
 */
module.exports = function (options) {
    options = options || {};
    var from = '/' + (options.from || DIR_FORM) + '/';
    var to = '/' + (options.to || DIR_TO) + '/';

    return function (context) {
        var path = require('path');
        var c2a = require('c2a');
        var pathname = context.request.pathname;
        var extname = path.extname(pathname);

        if (context.status === 404
            && pathname.indexOf(to) >= 0
            && extname === '.js'
        ) {
            // 先尝试进行tpl的处理
            var file = context.conf.documentRoot + pathname.replace('.tpl.js', '.tpl');
            // 如果还是没有找到文件就切换目录再次尝试
            if (!fs.existsSync(file)) {
                pathname = context.request.pathname = pathname.replace(to, from);
                file = context.conf.documentRoot + pathname.replace('.tpl.js', '.tpl');
            }
            // 如果还是米有找到就放弃吧
            if (!fs.existsSync(file)) {
                return;
            }

            context.status = 200;

            var handler;
            if (pathname.indexOf('.tpl') < 0) {
                handler = c2a.edpWebserver();
            }
            else {
                handler = html2js;
            }
            handler(context);
        }
    };

};
