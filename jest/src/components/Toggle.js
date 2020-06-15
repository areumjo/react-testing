import React, { Component } from 'react';
import styled from 'styled-components';

const HoverText = styled.p`
	color: #000;
	:hover {
		color: #ed1212;
		cursor: pointer;
	}
`

const Square = styled.div`
    height: 120px;
    width: 200px;
    margin: 100px;
    background-color: green;
    cursor: pointer;
    position: relative;
    &:hover {
        background-color: red;
    };
`

class Toggle extends Component {
    constructor(props) {
        super(props);
        this.toggleHover = this.toggleHover.bind(this);
        this.state = {
            hover: false,
            showBox: false
        }
    }
    
    toggleHover() {
        this.setState({hover: !this.state.hover})
    }

    handleBoxToggle = () => this.setState({ showBox: !this.state.showBox });
    
    render() {
       var linkStyle;
       if (this.state.hover) {
         linkStyle = {color: '#ed1212', cursor: 'pointer'}
       } else {
         linkStyle = {color: '#000'}
       }
       
        return (
            <>
                <p style={linkStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>toggle</p>
                <Square>square text</Square>
                <div
                    onMouseEnter={this.handleBoxToggle}
                    className={`container${this.state.showBox ? " show" : ""}`}
                    >
                    <div className="wrapper">
                        <div className="innerBox" />
                    </div>
                </div>
            </>
        )
    }
};

export default Toggle;
