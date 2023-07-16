import React from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <section className="navbar">
      <div className="flex items-center">
        <Link to="/" className="navbar_logocontainer">
          Roll on Flow
        </Link>
      </div>
      <div className="navbar_navigationcontainer">
        <Link to="/markets" className="navbar_navigationcontainer_nav">
          {/* <img src={Markets} alt="markets" /> */}
          <div>Games</div>
        </Link>
        <Link to="/leaderboard" className="navbar_navigationcontainer_nav">
          {/* <img src={Leaderboard} alt="leaderboard" /> */}
          <div>Leaderboard</div>
        </Link>
        <div className="navbar_navigationcontainer_separator"/>
        <div className="navbar_navigationcontainer_connectwallet">
          Connect Wallet
        </div>
        {/* <WalletDisconnectButton/> */}
      </div>
    </section>
  );
}
