// Test하고자 하는 것에 대해 test 함수를 작성한다.
// test 함수의 인자로 Test의 Description을 작성한다.
// 두 번째 인자로 주는 익명 함수가 실제로 Test 구동 시 실행될 함수이다.

// Example
// test('Add two numbers', () => {
//     const sum = 1 + 2;

//     // expect를 통해 해당 함수 내에서 생성된 특정 Value에 대해서 Verify할 수 있다.
//     expect(sum).toEqual(3);
// });

// Chromium Browser 제어를 위해 Puppeteer 라이브러리를 사용한다.
// 오타가 자주나므로 재차 확인한다.
const puppeteer = require('puppeteer');
const { session } = require('passport');

let browser, page;

beforeEach(async () => {
    // 1. launch 함수 내에 Empty Object를 잊지 말 것
    //      (Browser 생성에 이용할 인자를 추후에 추가함)
    // 2. 오타 내지 말 것
    // 생성된 browser는 Running Browser이며, Browser Object이다.
    browser = await puppeteer.launch({
        //  headless 값이 true일 경우, GUI에 대한 제공을 하지 않는다.
        headless: false,
    });

    // Browser Object의 newPage 함수를 통해 새로운 Page를 생성할 수 있다.
    // 생성된 page는 Running Tab이며, Page Object이다.
    // Page에서의 특정 요소를 클릭하게 할 수 있다.
    // Page를 다른 Page로 Navigate 시킬 수 있다.
    page = await browser.newPage();

    await page.goto('localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('Header Correct Text', async () => {
    const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);

    expect(text).toEqual('Blogster');
});

test('Click Login & Start OAuth Flow', async () => {
    // 1. 로그인 버튼을 누른다.
    await page.click('.right a');

    // 2. 화면 전환이 되어 올바른 Domain을 갖고 있는지 URL 비교를 통해 확인
    // Jest Document를 통해서 비슷한 기능을 수행하는 함수가 있는지 확인
    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});

test('When Signed In , Show Logout Button', async () => {
    const id = '5f560533c554e2b971e8bc82';

    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id,
        },
    };
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
        'base64'
    );

    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    // sessions=를 붙이는 이유는 Cookie Library가 이런식으로 이용하기 때문이다.
    // 꼭 Technical한 이유는 아니다.
    const sessionSignature = keygrip.sign('session=' + sessionString);

    // result value of generating for authentication
    console.log(sessionString);
    console.log(sessionSignature);

    await page.setCookie({ name: 'session', value: sessionString });
    await page.setCookie({ name: 'session.sig', value: sessionSignature });

    await page.goto('localhost:3000');
});
