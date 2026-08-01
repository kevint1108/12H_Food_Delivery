import React, { useContext, useEffect, useState, useRef } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("Home");

  const [showSearch, setShowSearch] = useState(false);

  const searchInputRef = useRef(null);

  const { getTotalCartAmount, cartItems, token, setToken, search, setSearch } = useContext(StoreContext);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const scrollToFoodDisplay = () => {
    setTimeout(() => {
      document.getElementById("food-display")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!showSearch) {
      setShowSearch(true);
      return;
    }

    navigate("/");
    setMenu("Home");
    scrollToFoodDisplay();
  };

  const toggleSearch = () => {
    if (!showSearch) {
      setShowSearch(true);
      return;
    }

    if (!search.trim()) {
      setShowSearch(false);
    } else {
      navigate("/");
      setMenu("Home");
      scrollToFoodDisplay();
    }
  };

  const clearSearch = () => {
    setSearch("");

    searchInputRef.current?.focus();
  };

  const handleLogoClick = () => {
    setMenu("Home");
    setShowSearch(false);
    setSearch("");
  };

  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);


  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("Mobile-app")} className={menu === "Mobile-app" ? "active" : ""}>Mobile-app</a>
        <a href='#footer' onClick={() => setMenu("Contact-us")} className={menu === "Contact-us" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <form className={showSearch ? "navbar-food-search open" : "navbar-food-search"} onSubmit={handleSearchSubmit}>
          <input ref={searchInputRef} type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search food..." aria-label="Search food" />
          {showSearch && search && (
            <button type="button" className="navbar-search-clear" onClick={clearSearch} aria-label="Clear search">×</button>
          )}
          <button type="button" className="navbar-search-button" onClick={toggleSearch} aria-label={showSearch ? "Search food" : "Open search"}>
            <img src={assets.search_icon} alt="" />
          </button>
        </form>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Shopping cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"} />
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile"/>
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="Orders"/><p>Orders</p>
              </li>

              <hr />

              <li onClick={logout}>
                <img src={assets.logout_icon} alt=""/>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
