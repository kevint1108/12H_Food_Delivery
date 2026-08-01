import React from "react";
import "./Header.css";

const Header = () => {
  const handleViewMenu = () => {
    const exploreMenu = document.getElementById("explore-menu");

    if (exploreMenu) {
      exploreMenu.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <header className="header">
      <div className="header-contents">
        <h2>Fresh Choices, Fast Delivery </h2>
        <p>Whether you're craving a quick lunch, a cozy dinner, or a late-night snack, we have got you covered. With 12H Delivery, great food is always just a few clicks away.</p>
        <button type="button" onClick={handleViewMenu}> View Menu</button>
      </div>
    </header>
  );
};

export default Header;