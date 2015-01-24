/**
 * @file edp-build processor
 * @author treelite(c.xinle@gmail.com)
 */

var minimatch = require('minimatch');
var extend = require('../util/extend');

/**
 * 默认的路径匹配模式
 *
 * @const
 * @type {Object}
 */
var DEFAULT_PATTERNS = {
    'json/route': ['route/*.json'],
    'json/tpl': ['tpl/*.json'],
    'template': ['tpl/**/*.tpl']
};

/**
 * 默认的配置参数
 *
 * @const
 * @type {Object}
 */
var DEFAULT_OPTIONS = {
    template: {
        wrap: true
    }
};

/**
 * build处理过程
 *
 * @inner
 * @param {Object} file 待处理文件
 * @param {Object} context 上下文对象
 * @param {Function} callback 回调函数
 * @return {*}
 */
function process(file, context, callback) {
    var fs = require('fs');
    var transfer = require('../../index');

    var patterns = Object.keys(this.patternMapper);
    var type;

    for (var i = 0, pattern; pattern = patterns[i]; i++) {
        if (minimatch(file.path, pattern)) {
            type = this.patternMapper[pattern];
            break;
        }
    }

    if (!type) {
        return callback();
    }

    var path = file.fullPath + '.js';
    if (this.clear) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
    else {
        fs.writeFileSync(path, transfer(type, file.data, this.options[type]), 'utf8');
    }

    callback();
}

/**
 * 创建处理器
 *
 * @inner
 * @param {Object} patterns 路径匹配模式
 * @param {Object} options 参数配置信息
 * @param {Object} properties 扩展参数
 * @return {Object}
 */
function createProcessor(patterns, options, properties) {
    var files = [];
    var patternMapper = {};
    var mapper = extend({}, DEFAULT_PATTERNS);
    mapper = extend(mapper, patterns || {});

    // 将按类型划分的路径匹配模式
    // 转化成路径匹配数组（用于处理器的files属性）
    // 与路径-类型Map 方便后续处理
    var items;
    Object.keys(mapper).forEach(function (type) {
        items = mapper[type];
        if (!Array.isArray(items)) {
            items = [items];
        }
        items.forEach(function (item) {
            files.push(item);
            patternMapper[item] = type;
        });
    });

    var res = {
        files: files,
        process: process,
        patternMapper: patternMapper,
        options: extend(extend({}, DEFAULT_OPTIONS), options || {})
    };

    res = extend(res, properties || {});

    return res;
}

/**
 * 创建builder与clear
 *
 * @public
 * @param {Object} patterns build选择器
 * @param {Object} options 参数
 * @return {Object}
 */
module.exports = function (patterns, options) {
    return {
        builder: createProcessor(patterns, options, {name: 'RebasTransfer'}),
        clear: createProcessor(patterns, options, {name: 'RebasTransfer-Clear', clear: true})
    };
};
