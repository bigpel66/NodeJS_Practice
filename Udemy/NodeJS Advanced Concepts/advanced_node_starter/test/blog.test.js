const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();

    await page.goto('localhost:3000');
});

afterEach(async () => {
    await page.close();
});

// All test statement changed into describe statement
// test('When logged in, can see blog create form', async () => {
//     await page.login();

//     await page.click('a.btn-floating');

//     const label = await page.getContentsOf('form label');

//     expect(label).toEqual('Blog Title');
// });

describe('When logged in', async () => {
    // beforeEach statement affect all of the descibe and test in root describe
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('Can see blog create form', async () => {
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('When using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'mytitle');
            await page.type('.content input', 'mycontent');
            await page.click('form button');
        });

        test('Submitting takes user to a review screen', async () => {
            const reviewText = await page.getContentsOf('h5');
            expect(reviewText).toEqual('Please confirm your entries');
        });

        test('Submitting then saving adds blog to "Blog Index" page', async () => {
            await page.click('button.green');

            // Need to wait until the post being created
            await page.waitFor('.card');

            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('mytitle');
            expect(content).toEqual('mycontent');
        });
    });

    describe('When using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('Submitting shows error messages', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');
        });
    });
});

describe('When not logged in', async () => {
    const actions = [
        {
            method: 'get',
            path: '/api/blogs',
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C',
            },
        },
    ];

    test('Blog related actions are prohibited', async () => {
        const results = await page.execRequests(actions);

        for (let result of results) {
            expect(result).toEqual({ error: 'You must log in!' });
        }
    });
});
