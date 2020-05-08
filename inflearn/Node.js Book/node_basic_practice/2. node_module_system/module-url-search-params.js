const url = require('url');
const URL = url.URL;
const newUrl = new URL(
    'https://smartstore.naver.com/2ditor/products/559925425?NaPm=ct%3Dk9r91pic%7Cci%3Dcheckout%7Ctr%3Dppc%7Ctrx%3D%7Chk%3Dfb7a24787ed043dde3b19e96807b6cfafb5bb1b3'
);

console.log('searchParams: ', newUrl.searchParams);

console.log('searchParams.getAll(): ', newUrl.searchParams.getAll('NaPm'));
console.log('searchParams.get(): ', newUrl.searchParams.get('NaPm'));
console.log('searchParams.has(): ', newUrl.searchParams.has('category'));

console.log('searchParams.keys(): ', newUrl.searchParams.keys());
console.log('serachParams.values(): ', newUrl.searchParams.values());

newUrl.searchParams.append('filter', 'es3');
newUrl.searchParams.append('filter', 'es5');
console.log(newUrl.searchParams.getAll('filter'));

newUrl.searchParams.set('filter', 'es6');
console.log(newUrl.searchParams.getAll('filter'));

newUrl.searchParams.delete('filter');
console.log(newUrl.searchParams.getAll('filter'));

console.log('searchParams.toString()', newUrl.searchParams.toString());
newUrl.search = newUrl.searchParams.toString();
