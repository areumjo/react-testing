import React from 'react';
import ReactDOM from 'react-dom';

import { render } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";


import Button from './Button.js';

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button></Button>, div)
})

test("renders button correctly", () => {
    const { getByTestId } = render(<Button></Button>)
    expect(getByTestId('button')).toHaveTextContent("Click")
})