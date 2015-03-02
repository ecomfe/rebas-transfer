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

    // 清除阶段
    if (this.clear) {
        // 删除以前生成的临时文件
        return fs.unlink(file.fullPath, next);
    }

    // 对路径进行相应替换
    // 以生成正确的临时文件与构建后的目标文件
    var path = file.path.replace(this.from, this.to);
    file.fullPath = file.fullPath.replace(this.from, this.to);
    file.outputPath = path;

    if (file.extname === 'tpl') {
        handleTpl(file);
    }
    else if (file.extname === 'js') {
        handleCommonJS(file);
    }

    // 写入临时文件
    fs.writeFile(file.fullPath, file.data, next);
};


/**
 * 创建处理器
 *
 * @public
 * @param {Object=} options 配置参数
 */
module.exports = function (options) {
    return new Processor(options);
};
