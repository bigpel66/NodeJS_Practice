const fs = require('fs');

// SELF MADE ERROR
setInterval(() => {
    console.log('시작');
    try {
        throw new Error('Server Crash');
    } catch (err) {
        console.error(err);
    }
}, 1000);

// ERROR FROM INTERNAL MODULE
setInterval(() => {
    fs.unlink('./thereisnofile.js', (err) => {
        if (err) {
            console.log('시작');
            console.log(err);
            console.log('끝');
        }
    });
}, 1000);

// ERROR CATCH WITHOUT TRY CATCH
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception', err);
});
setInterval(() => {
    throw new Error('Server Crash');
}, 1000);
setTimeout(() => {
    console.log('Executed');
}, 2000);
