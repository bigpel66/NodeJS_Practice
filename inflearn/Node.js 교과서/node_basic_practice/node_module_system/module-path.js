const path = require('path');

console.log(path.sep);
console.log(path.delimiter);
console.log(path.dirname(__filename));
console.log(path.extname(__filename));
console.log(path.basename(__filename));
console.log(path.parse(__filename));
console.log(
    path.format({
        root: '/',
        dir:
            '/Users/bigpel/git/NodeJS_Practice/inflearn/Node.js 교과서/node_basic_practice/node_module_system',
        base: 'module-path.js',
        ext: '.js',
        name: 'module-path',
    })
);
console.log(
    path.normalize(
        '/Users/bigpel/git/NodeJS_Practice/inflearn/Node.js 교과서/node_basic_practice/node_module_system/module-path.js'
    )
);
console.log(
    path.isAbsolute(
        '/Users/bigpel/git/NodeJS_Practice/inflearn/Node.js 교과서/node_basic_practice/node_module_system/module-path.js'
    )
);
console.log(
    path.relative(
        '/Users/bigpel/git/NodeJS_Practice/inflearn/Node.js 교과서/node_basic_practice/node_module_system/module-path.js',
        '/'
    )
);
console.log(path.join(__dirname, '..', '..', '/joined', '.', '/path'));
console.log(path.resolve(__dirname, '..', '..', '/joined', '.', '/path'));
