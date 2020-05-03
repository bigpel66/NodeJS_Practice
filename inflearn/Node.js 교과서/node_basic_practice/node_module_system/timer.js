const timeout1 = setTimeout(() => {
    console.log('1.5초 후 실행');
}, 1500);

const timeout2 = setTimeout(() => {
    console.log('실행되지 않습니다.');
}, 3000);

const interval = setInterval(() => {
    console.log('1초마다 실행');
}, 1000);

setTimeout(() => {
    clearTimeout(timeout2);
    clearInterval(interval);
}, 2500);

const immediate = setImmediate(() => {
    console.log('즉시 Event Loop를 통해 Task Queue로 이동합니다.');
});

clearImmediate(immediate);
