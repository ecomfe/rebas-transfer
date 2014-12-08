/**
 * @file 文本整体缩进
 * @author treelite(c.xinle@gmail.com)
 */

module.exports = function (str, indent) {
    var indentStr = new Array(indent + 1);
    indentStr = indentStr.join(' ');

    str = str.replace(/\n([^\n])/g, function ($0, $1) {
        return '\n' + indentStr + $1;
    });

    return indentStr + str;
};
