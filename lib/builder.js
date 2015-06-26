/**
 * @file 项目构造处理器
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 默认的代码源文件夹
 *
 * @const
 * @type {string}
 */
var DIR_FROM = 'lib';

/**
 * 默认的代码目标文件夹
 *
 * @const
 * @type {string}
 */
var DIR_TO = 'src';

/**
 * 默认的处理文件
 *
 * @const
 * @type {Array}
 */
var FILES = [DIR_FROM + '/**/*.js', DIR_FROM + '/**/*.tpl'];

/**
 * 处理模版文件
 *
 * @inner
 * @param {Object} file 文件对象
 */
function handleTpl(file) {
    var html2js = require('html2js');
    file.data = html2js(file.data, {wrap: true});
    file.path += '.js';
    file.fullPath += '.js';
    file.outputPath += '.js';
}

/**
 * 处理CommonJS文件
 *
 * @param {Object} file 文件对象
 */
function handleCommonJS(file) {
    var c2a = require('c2a');
    file.data = c2a(file.data);
}

/**
 * Processor
 *
 * @constructor
 * @param {Object} options 构建参数
 */
function Processor(options) {
    options = options || {};
    this.files = options.files || FILES;
    this.from  = options.from || DIR_FROM;
    this.to = options.to || DIR_TO;
    this.clear = options.clear || false;
}

/**
 * 处理器名称
 *
 * @type {string}
 */
Processor.prototype.name = 'RebasTransfer';

/**
 * 构建处理
 *
 * @public
 * @param {Object} file 文件对象
 * @param {Object} context 构建上下文
 * @param {Function} next 进行下一个构建处理
 */
Processor.prototype.process = function (file, context, next) {
    var fs = require('fs');

    // 对路径进行相应替换
    // 以生成正确的临时文件与构建后的目标文件
    var path = file.path.replace(this.from, this.to);
    var fullPath = file.fullPath.replace(this.from, this.to);

    // 如果目标目录下有重名的文件就放弃处理
    if (fs.existsSync(fullPath)) {
        next();
        return;
    }

    context.removeFile(file.path);

    file.path = path;
    file.outputPath = path;
    file.fullPath = fullPath;

    if (file.extname === 'tpl') {
        handleTpl(file);
    }
    else if (file.extname === 'js') {
        handleCommonJS(file);
    }

    context.addFile(file);

    next();
};


/**
 * 创建处理器
 *
 * @public
 * @param {Object=} options 配置参数
 * @return {Object}
 */
module.exports = function (options) {
    return new Processor(options);
};
