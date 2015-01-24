/**
 * @file extend
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * extend
 *
 * @param {Object} source 源对象
 * @param {...Object} targets 拷贝对象
 * @return {Object}
 */
module.exports = function (source) {
    var targets = Array.prototype.slice.call(arguments, 1);

    targets.forEach(function (item) {
        item = item || {};
        Object.keys(item).forEach(function (key) {
            source[key] = item[key];
        });
    });

    return source;
};
