/**
 * fis3-hook-babel-imweb
 * 扫描文件内容，如果发现有 es6 语法，则使用 fis3-parser-babel-imweb 插件编译文件内容
 * 如果已经做了 babel 编译或者不需要 hook 的，请添加 notHookBabel 属性
 * 
 */

var babelIMWeb = require('fis3-parser-babel-imweb');
var defaults = {
    defaultCheckRegList: [/useES6:\s*true/, /^\s*(import|const|let|export)\s|=>\s*\{|[^"']`[^`]*\$\{[^`}]+\}[^`]*`|\sclass\s+\w+\s+(extends\s+\w+\s+)?\{/m],
    checkRegList: [],
    defaultCheckFnList: [],
    checkFnList: [],
    shutup: false,
    babelOpts: {}
};

function transformFile(fis, file, opts) {
    !opts.shutup && fis.log.warn('babel transform: %s', file.id);
    var content = file.getContent();

    content = babelIMWeb(content, file, opts.babelOpts || {});
    file.setContent(content);
}

function process(fis, file, opts) {
    var _ = fis.util;
    var checkRegs = (opts.defaultCheckRegList || defaults.defaultCheckRegList)
        .concat(opts.checkRegList || defaults.checkRegList);
    var checkFns = (opts.defaultCheckFnList || defaults.defaultCheckFnList)
        .concat(opts.checkFnList || defaults.checkFnList);
    var content = file.getContent();

    var isES6 = false;
    if (/\.es6\.js$/.test(file.subpath)) {
        transformFile(fis, file, opts);
        return;
    }

    var reg, fn;
    for (var i = 0, l = checkRegs.length; i < l; ++i) {
        reg = checkRegs[i];
        if (reg instanceof RegExp && reg.test(content)) {
            isES6 = true;
            break;
        }
    }

    if (isES6) {
        transformFile(fis, file, opts);
        return;
    }

    for (i = 0, l = checkFns.length; i < l; ++i) {
        fn = checkFns[i];
        if ('function' === typeof fn && fn(content)) {
            isES6 = true;
            break;
        }
    }

    if (isES6) {
        transformFile(fis, file, opts);
    }
}

var entry = (module.exports = function(fis, opts) {
    // preprocessor 阶段之前，也就是 parser 阶段之后
    fis.on('compile:preprocessor', function(file) {
        if (file.notHookBabel || !file.isJsLike) {
            return;
        }

        process(fis, file, opts);
    });
});

entry.defaults = defaults;
