/**
 * @file edp-build processor
 * @author treelite(c.xinle@gmail.com)
 */

var minimatch = require('minimatch');
var extend = require('../util/extend');

var defaultPatterns = {
    'json/route': ['route/*.json'],
    'json/tpl': ['tpl/*.json'],
    'template': ['tpl/**/*.tpl']
};

var defaultOptions = {
    template: {
        wrap: true
    }
};

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

function createProcessor(patterns, options, properties) {
    var files = [];
    var patternMapper = {};
    var mapper = extend({}, defaultPatterns);
    mapper = extend(mapper, patterns || {});

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
        options: extend(extend({}, defaultOptions), options || {})
    };

    res = extend(res, properties || {});

    return res;
}

module.exports = function (patterns, options) {
    return {
        builder: createProcessor(patterns, options, {name: 'RebasTransfer'}),
        clear: createProcessor(patterns, options, {name: 'RebasTransfer-Clear', clear: true})
    };
};
