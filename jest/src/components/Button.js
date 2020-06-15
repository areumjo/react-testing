import React from "react";
import styled from 'styled-components';
 
const StyledButton = styled.button`
    cursor: pointer;
    background: transparent;
    font-size: 16px;
    border-radius: 3px;
    color: palevioletred;
    border: 2px solid palevioletred;
    margin: 0 1em;
    padding: 0.25em 1em;
    transition: 0.5s all ease-out;
    
    &:hover {
        background-color: palevioletred;
        color: white;
    }
`;

const Button = () => {
    return (
        <div data-testid="button">
            <StyledButton>Click this button</StyledButton>
        </div>
    )
};

export default Button;