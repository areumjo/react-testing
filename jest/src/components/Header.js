import React from "react";

function Header () {

    function changeBackground(e) {
        e.target.style.background = 'red';
        e.target.style.color = 'white';
    }

    function changeBack(e) {
        e.target.style.background = 'green';
    }

    return (
        <div>
            <h2 onMouseOver={changeBackground} onMouseLeave={changeBack}>Hover over me!</h2>
            <div style={{display: "none"}}>
                <p>show 1</p>
                <p>show 2</p>
            </div>
        </div>
    )
};

/*
The only difference between onMouseOut vs onMouseLeave is that the onMouseLeave event does not bubble. When an event bubbles, it moves, or propagates, up the DOM hierachy.

*/
export default Header;