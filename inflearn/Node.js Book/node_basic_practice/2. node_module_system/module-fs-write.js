const fs = require('fs');

fs.writeFile('./files/WRITEME.txt', 'WRITEME', (err, data) => {
    if (err) {
        throw err;
    }
    fs.readFile('./files/WRITEME.txt', (err, data) => {
        if (err) {
            throw err;
        }
        console.log(data.toString());
    });
});
