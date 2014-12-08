/**
 * @file 文本整体缩进
 * @author treelite(c.xinle@gmail.com)
 */

module.exports = function (str, indent) {
    var str = new Array(indent + 1);
    str = str.join(' ');

    return str.replace(/\n([^\n])/g, function ($0, $1) {
        return '\n' + str + $1;
    });
};
