# Testing React

## Jest
- [Create React App](https://create-react-app.dev/docs/running-tests) uses `Jest` as its test runner.
- Jest is a Node-based runner meaning tests always run in a `Node` environment (not in a real browser).
- Jest is intended to be used for `unit test` of your logic and component rather than the DOM quirks.

### Filename Conventions
- Files with `.js` suffix in `__tests__` folders.
- Files with `.test.js` suffix.
- Files with `.spec.js` suffix.

- Files with those name can be located at any depth under the `src` top level folder.
- Recommendation : put the test files (or `__tests__` folders) next to the code ==> relative imports appear shorter

### Command Line Interface
- ```npm test```
- `watch` mode
    - an interactive command-line interface with the ability to run all tests
    - Watch Usage : automatically re-run when you change your code
    - Press a to run all tests.
        - Press f to run only failed tests.
        - Press q to quit watch mode.
        - Press p to filter by a filename regex pattern.
        - Press t to filter by a test name regex pattern.
        - Press Enter to trigger a test run.

### Writing Tests
- `it()`
- `test()`

### Testing Components
- Smoke test : verifying that a component renders without throwing, to shallow rendering aand testing some of the output
```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
});
// this test mounts a component and makes sure that it didn't throw during rendering
```

- React Testing Library
    - `react-testing-library` is a library for testing React components in a way that resembles the way the components are used by end users
    - well suited for unit testing || integration testing || end-to-end testing of React components and applications
    - Works more directly with DOM nodes ==> recommend to use with `jest-dom` for improved assertions
```js
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

it('renders welcome message', () => {
    const { getByText } = render(<App />);
    expect(getByText('Learn React')).toBeInTheDocument();
});
```

### Initializaing Test Enviornment
- When you need a global setup before running your tests ==> add a `src/setupTest.js` // will be automatically executed before running your tests

### Matchers - helper function
- `expect()`
- `.toBe()`
- `.toEqual()` : check the value of an `object`
- `.toMatch()` : check `strings` against regular expressions
    ```js
    test('there is no I in team', () => {
        expect('team').not.toMatch(/I); // pass
    });
    ```
- `toContain()` : check if an `array` or iterable contains a particular item 

## Testing Async Code
### Callbacks
- The most common async pattern
    - i.e) you have a `fetchData(callback)` function that fetches some data and calls `callback(data)` when it is complete ==> uses a single arguement called `done`
- `done` : Jest will wait until the `done` callback is called before finishing the test
    ```js
    test('the data is pike place bet?', () => {
        function callback(data) {
            try {
                expect(data).toBe('pike place');
                done();
            } catch (error) {
                done(error);
            }
        }
        fetchData(callback);
    })
    ```

### Promises
- Return a promise from  your test, and Jest will wait for that promise to resolve
    - if the promise is rejected, the test will automatically fail
    ```js
    test('the data is pike place bet?', () => {
        return fetchData().then(data => {
            expect(data).toBe('pike place');
        });
    });
    ```


## JS testing - Unit Test, Integration Tests & e2e (UI) Tests
- Automate testing whenever you change your codes (not need to do manually)
- Why test?
    - get an error if you break code || save time || think about possible issues & bugs || integrate into build workflow || break up complex dependencies || improve your code
- Different kinds of tests (complexity increases // frequency decrease)
    - fully isolated (testing one function) ==> Unit tests
        - drill down to the smallest unit
    - with dependencies (testing a function that calls a function) ==> integration tests
    - full flow (validating a the DOM after a click) ==> End-to-End (E2E) test

### Testing setup
- `Jest`
    1. Test Runner : execute your test, summarize results - `Mocha`
    2. Assertion library : define testing logic, conditions - `Chai`
- 3. Headless Browser : simulates browser interaction for E2E test- `puppeteer`
    - all work with `promise` and `await` function
```js
// util.test.js for unit testing
const { generateText, checkAndGenerate } = require('./util'); // import this function (native way to import)

test('should output name and age', () => {
    const text = generateText('Max', 21); // 1) test runner
    expect(text).toBe('Max (21 years old)'); // 2) assertion library
    const text2 = generateText('Anna', 25);
    expect(text2).toBe('Anna (25 years old)');
});

test('should output data-less text', () => {
    const text = generateText('', null); 
    expect(text).toBe(' (null years old)'); 
});

// integration test needed - even if all unit tests pass, how they are called or worked together might not work like that
test('should generate a valid text output', () => {
    const text = checkAndGenerate('Max', 20);
    expect(text).toBe('Max (20 years old)');
});

// E2E test
const puppeteer = require('puppeteer');
test('should click around', async () => {
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 80,
        // args: ['--window-size=1920,1080'] // commenting these configs will reduce time of testing
    });
    const page = await browser.newPage();
    await page.goto(
        'file:///users/.../index.html'
    )
    await page.click('input#name');
    await page.type('input#name', 'Anna');
    await page.click('input#age');
    await page.type('input#age', '23');
    await page.click('$btnAddUser');
    const finalText = await page.$eval('.user-item', el => el.textContent);
    expect(finalText).toBe('Anna (28 years old)');
}, 10000); // add more time to test (default is 5000)
```

- Mocking Async Code 
    - api is not something you want to do testing // `axios` types of 3rd party libray // or any file system
    - we want to make a mock to test those above
```js
// __mocks__ http.js
const fetchData = () => {
    return Promise.resolve({ title: 'delectus aut autem' });
};
exports.fetchData = fetchData;

// __mocks__ axios.js : testing mocking one more above
const get = url => {
  return Promise.resolve({ data: { title: 'delectus aut autem' } });
};
exports.get = get;
```