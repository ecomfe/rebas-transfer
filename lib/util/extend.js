/**
 * @file extend
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * extend
 *
 * @param {Object} source
 * @param {Object} target
 * @return {Object}
 */
module.exports = function (source, target) {
    Object.keys(target).forEach(function (key) {
        source[key] = target[key];
    });

    return source;
};
