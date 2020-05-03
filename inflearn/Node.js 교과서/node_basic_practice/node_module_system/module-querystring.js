const url = require('url');
const querystring = require('querystring');
const parsedUrl = url.parse(
    'https://smartstore.naver.com/2ditor/products/559925425?NaPm=ct%3Dk9r91pic%7Cci%3Dcheckout%7Ctr%3Dppc%7Ctrx%3D%7Chk%3Dfb7a24787ed043dde3b19e96807b6cfafb5bb1b3'
);
const query = querystring.parse(parsedUrl.query);

console.log('querystring.parse(): ', query);
console.log('querystring.stringify(): ', querystring.stringify(query));
