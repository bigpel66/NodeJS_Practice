const string = 'abc';
const number = 1;
const boolean = true;
const obj = {
    outsied: {
        inside: {
            key: 'value',
        },
    },
};

console.time('전체 시간');

console.log(`String: ${string}, Number: ${number}, Boolean: ${boolean}`);
console.error('This is an Error message');
console.dir(obj, { colors: false, depth: 2 });
console.dir(obj, { colors: true, depth: 1 });

console.time('시간 측정');
for (let i = 0; i < 100000; i++) {
    continue;
}
console.timeEnd('시간 측정');

console.timeEnd('전체 시간');

function secondRoute() {
    console.trace('에러 위치 추적');
}
function firstRoute() {
    secondRoute();
}
firstRoute();
