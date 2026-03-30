import { useState } from "react";
import "./Header.css";

export default function Header() {
  //Variables to store the state of the button
  const [isOpen, setIsOpen] = useState(false);
  //Variable for the dropDown
  let dropDownMenu = null;

  const toggleMenu = function () {
    if (isOpen === false) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // HTML for the dropDown menu, it will show up when isOpen === true
  if (isOpen === true) {
    dropDownMenu = (
      <div id="drop-down-menu-open">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="/secondPage">Second Page</a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <header>
      <div id="drop-down-menu">
        <button onClick={toggleMenu} aria-expanded={isOpen}>
          Menu
        </button>

        {/* Okay, so in react, when something is in {} then it reads as javascript, and if is in () it reads as html */}
        {dropDownMenu}
      </div>

      <div id="project-name">
        <p>[Project-Name]</p>
      </div>
    </header>
  );
}
