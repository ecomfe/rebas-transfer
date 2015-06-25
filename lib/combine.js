/**
 * @file 合并模块
 * @author treelite(c.xinle@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var amd = require('edp-core').amd;

/**
 * 前端代码目录
 *
 * @const
 * @type {string}
 */
var SRC_DIR = 'src';

/**
 * 默认的路由文件
 *
 * @const
 * @type {string}
 */
var ROUTE_FILE = 'lib/config'

/**
 * 默认的入口模块
 *
 * @const
 * @type {string}
 */
var DEFAULT_ENTRY = 'app';

/**
 * 合并数组
 * 不合并重复的元素
 *
 * @param {Array} source 原数组
 * @param {...Array} targets 待合并的数组
 * @return {Array}
 */
function combine(source) {
    var targets = Array.prototype.slice.call(arguments, 1);

    targets.forEach(function (target) {
        target.forEach(function (item) {
            if (source.indexOf(item) < 0) {
                source.push(item);
            }
        });
    });

    return source;
}

/**
 * 获取模块的依赖
 *
 * @param {string} file 模块文件地址
 * @param {string} moduleId 模块id
 * @return {Array}
 */
function getDependencis(file, moduleId) {
    var res = [];

    if (!fs.existsSync(file)) {
        return res;
    }

    var codeAST = amd.getAst(fs.readFileSync(file));
    var info = amd.analyseModule(codeAST);

    var dependencies = info.actualDependencies || [];

    return dependencies.slice(info.factoryAst.params.length).map(function (id) {
        return amd.resolveModuleId(id, moduleId);
    });
}

/**
 * 获取用户自定义的依赖模块
 *
 * @param {*} info 自定义的合并信息
 * @return {Object|boolean} 依赖模块
 */
function getCustomDeps(info) {
    var res = [];

    if (info.modules && Array.isArray(info.modules)) {
        info = info.modules;
    }
    else {
        info = [];
    }

    info.forEach(function (item) {
        // 只包含额外需要包含的模块
        // 对额外排除的模块不做处理
        if (item.charAt(0) === '~') {
            res.push(item.substring(1));
        }
    });

    return res;
}

/**
 * 配置模块合并参数
 *
 * @public
 * @param {Object=} options 配置参数
 * @param {string=} options.src 前端代码目录
 * @param {string=} options.route 路由配置信息文件
 * @param {string|Array=} options.entries 需要合并业务模块的入口文件
 * @return {Object}
 */
module.exports = function (options) {
    options = options || {};

    var cwd = process.cwd();
    var routeFile = options.route || path.resolve(cwd, ROUTE_FILE);
    var srcDir = options.src || path.resolve(cwd, SRC_DIR);
    var routeInfo = require(path.resolve(cwd, routeFile));

    return {
        getCombineConfig: function (config) {
            config = config || {};

            var commonModules = Object.keys(config);
            var commonDeps = [];

            commonModules.forEach(function (id) {
                var file = path.resolve(srcDir, id + '.js');
                combine(commonDeps, getDependencis(file, id), getCustomDeps(config[id]));
            });

            var excludeModules = commonDeps.map(function (item) {
                return '!~' + item;
            });

            // 处理业务模块
            var bizModules = [];
            routeInfo.forEach(function (item) {
                var id = item.action;
                if (!id || bizModules.indexOf(id) >= 0) {
                    return;
                }

                bizModules.push(id);
                // 添加所有的业务模块的合并配置信息
                // 排除所有的公共依赖
                config[id] = {
                    modules: excludeModules
                };

            });

            // 处理需要合并业务模块的入口模块
            if (bizModules.length) {
                bizModules = bizModules.map(function (item) {
                    return '~' + item;
                });
                var entries = options.entries || DEFAULT_ENTRY;
                if (!Array.isArray(entries)) {
                    entries = [entries];
                }
                entries.forEach(function (id) {
                    var info = config[id];
                    if (!info.modules || !Array.isArray(info.modules)) {
                        info = {
                            modules: []
                        };
                    }
                    info.modules = info.modules.concat(bizModules);
                    config[id] = info;
                });
            }

            console.log(JSON.stringify(config, null, 4));
            return config;
        }
    };

};
