import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="name" />
            <p> 12H Delivery brings your favorite meals straight to your door, fast and fresh. Stay connected with us for the latest deals, new dishes, and special offers.</p>
            <div className="footer-social-icon">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-right">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-center">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1 909-491-4567</li>
                <li>contact@12HDeli.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright"> Copyright 2026 @12H Delivery.com - All Right</p>
    </div>
  )
}

export default Footer
