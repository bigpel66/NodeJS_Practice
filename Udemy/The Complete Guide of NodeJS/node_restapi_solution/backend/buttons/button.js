const getButton = document.getElementById('get');
const postButton = document.getElementById('post');

getButton.addEventListener('click', () => {
    fetch('http://localhost:8080/feed/posts')
        .then((result) => {
            return result.json();
        })
        .then((resultData) => {
            console.log(resultData);
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
});

postButton.addEventListener('click', () => {
    fetch('http://localhost:8080/feed/post', {
        method: 'POST',
        body: JSON.stringify({ title: 'A Codepen Post', content: 'content' }),
        header: { 'Content-Type': 'application/json' },
    })
        .then((result) => {
            return result.json();
        })
        .then((resultData) => {
            console.log(resultData);
        })
        .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
});
