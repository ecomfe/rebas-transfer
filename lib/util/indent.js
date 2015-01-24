/**
 * @file 文本整体缩进
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 文本缩进
 *
 * @public
 * @param {string} str 文本
 * @param {number} indent 缩进数量
 * @return {string}
 */
module.exports = function (str, indent) {
    var indentStr = new Array(indent + 1);
    indentStr = indentStr.join(' ');

    str = str.replace(/\n([^\n])/g, function ($0, $1) {
        return '\n' + indentStr + $1;
    });

    return indentStr + str;
};
