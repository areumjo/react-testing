import React, { Component } from 'react';

class Hover extends Component {
  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      isHovering: false,
    };
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering,
    };
  }

  render() {
    return (
      <div>
        <div
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}
        >
          Hover Me
        </div>
        {
          this.state.isHovering &&
          <li className="box-hover">
            Farmer's market
            <ul>About us</ul>
            <ul>Contact us</ul>
          </li>
        }
      </div>
    );
  }
}

export default Hover;