import React, { useState } from 'react';

import Button from './button.js';

const Navbar = () => {

  const [menu, setMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  
  const showMenu = () => {
    if (window.innerWidth <= 960) {
      setMenu(true);
    } else {
      setMenu(false);
    }
  };
  const handleMenuClick = () => setOpenMenu(!openMenu);

  window.addEventListener('load', showMenu);
  window.addEventListener('resize', showMenu);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          EcoCitizen<i className="material-icons">cloud</i>
        </a>
        <div className={openMenu ? 'navbar-menu active' : 'navbar-menu'}>
          <div className="navbar-menu-item" onClick={handleMenuClick}>
            <a href="#mapa"><Button style='btn--outline'>Mapa</Button></a>
          </div>
          <div className="navbar-menu-item" onClick={handleMenuClick}>
            <a href="#treatment"><Button style='btn--outline'>Tratamiento</Button></a>
          </div>
          <div className="navbar-menu-item" onClick={handleMenuClick}>
            <a href="#alternative"><Button style='btn--outline'>Alternativas</Button></a>
          </div>
        </div>
        {menu ? (
          <span className="navbar-menu-icon" onClick={handleMenuClick}>
            {!openMenu ? 
              (<i className="material-icons">menu</i>) 
            :
              (<i className="material-icons">close</i>)
            }
          </span>
        ) : null }
      </div>
    </nav>
  );
};

export default Navbar;