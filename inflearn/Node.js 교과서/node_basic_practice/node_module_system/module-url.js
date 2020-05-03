const url = require('url');
const URL = url.URL;

const newUrl = new URL(
    'https://smartstore.naver.com/2ditor/products/559925425?NaPm=ct%3Dk9r91pic%7Cci%3Dcheckout%7Ctr%3Dppc%7Ctrx%3D%7Chk%3Dfb7a24787ed043dde3b19e96807b6cfafb5bb1b3'
);

// NEWER WAY - WHATWG
console.log('new URL(): ', newUrl);
console.log('url.format(): ', url.format(newUrl));

const parsedUrl = url.parse(
    'https://smartstore.naver.com/2ditor/products/559925425?NaPm=ct%3Dk9r91pic%7Cci%3Dcheckout%7Ctr%3Dppc%7Ctrx%3D%7Chk%3Dfb7a24787ed043dde3b19e96807b6cfafb5bb1b3'
);

// OLDER WAY
console.log('url.parse(): ', parsedUrl);