# fis3-hook-babel-imweb
fis3 插件
在`parse`阶段之后，扫描文件内容，根据某些 es6 特性规则判断文件内容是否使用了 es6 语法
如果判定是，则使用`fis3-parser-babel-imweb`插件对文件内容进行`babel`编译
如果判定否，则不做任何事情

## Install
``` bash
npm install fis3-hook-babel-imweb
```

## Usage
add this code to `fis.conf`
``` javascript
fis.hook('babel-imweb', {
  shutup: true,
  babelOpts: {
    sourceMapRelative: true
  }
});
```
检测顺序：
1. `file.notHookBabel`为真时，直接返回
2. 不是js类型文件（即`!file.isJsLike`），直接返回
3. 文件后缀为`.es6.js`时，编译
4. 文件头注释有`useES6: true`时，编译
5. 根据参数检测文件内容，符合时，编译

## options
* `defaultCheckRegList` [Array]: 默认正则检测列表，默认值为
``` javascript
[/useES6:\s*true/, /^\s*(import|const|let|export)\s|=>\s*\{|[^"']`[^`]*\$\{[^`}]+\}[^`]*`|\sclass\s+\w+\s+(extends\s+\w+\s+)?\{/m]
```
默认检测 es6 语法：`const`, `let`, `import`, `export`, `class`, `=>`, &#0096;&#0096;<br>
还检测了 `useES6: true`，可以在文件头注释里面添加这个强制编译

* `checkRegList` [Array]: 正则检测列表，需要新增一些检测规则的可以添加这个参数，先检测`defaultCheckRegList`的正则，再检测这里的
* `defaultCheckFnList` [Array]: 和`defaultCheckRegList`一样，只是这里放的是函数，函数签名： `Boolean function(String content)`，返回是否包含 ES6 语法，目前默认值为`[]`
* `checkFnList` [Array]: `checkRegList`一样，只是这里放的是函数。
* `shutup` [Boolean]: 是否关闭展示编译了哪些文件
* `babelOpts` [Object]: `fis3-parser-babel-imweb`插件使用到的参数，目前只有`sourceMapRelative`这个参数可以用
