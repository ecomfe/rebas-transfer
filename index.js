/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 项目构建处理器
 *
 * @public
 */
exports.builder = require('./lib/builder');

/**
 * webserver处理器
 *
 * @public
 */
exports.server = require('./lib/server');

/**
 * 模块合并配置
 *
 * @public
 */
exports.combine = require('./lib/combine');
