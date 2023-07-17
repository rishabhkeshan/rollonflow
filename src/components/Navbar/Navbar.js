import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import * as fcl from "@onflow/fcl";

fcl.config({
  "app.detail.icon": "https://cdn-icons-png.flaticon.com/512/1232/1232342.png",
  "app.detail.title": "Roll on Flow",
  "accessNode.api": "https://rest-testnet.onflow.org",
  // "discovery.authn.include": ["0x9d2e44203cb13051"],
  "discovery.authn.endpoint":
    "https://fcl-discovery.onflow.org/api/testnet/authn",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "fcl.eventPollRate": 3000,
});

export default function Navbar() {
  const [services, setServices] = useState([]);
    const [userAddress, setUserAddress] = useState("");

    useEffect(() => {
      fcl.discovery.authn.subscribe((res) => {
        setServices(res.results);
      });

      fcl.currentUser().subscribe((user) => {
        console.log("user",user);
        if (user.loggedIn) {
          setUserAddress(user.addr);
        } else {
          setUserAddress("");
        }
      });
    }, []);
      const handleDisconnect = () => {
        fcl.unauthenticate();
      };
    console.log(services);
    console.log(userAddress);  

  return (
    <section className="navbar">
      <div className="flex items-center">
        <Link to="/" className="navbar_logocontainer">
          Roll on Flow
        </Link>
      </div>
      <div className="navbar_navigationcontainer">
        <Link to="/" className="navbar_navigationcontainer_nav">
          <div>Games</div>
        </Link>
        <a rel="noreferrer" target="_blank" href="https://github.com/rishabhkeshan/rollonflow" className="navbar_navigationcontainer_nav">
          <div>GitHub</div>
        </a>
        <div className="navbar_navigationcontainer_separator" />
        {userAddress ? (
          <div
            onClick={handleDisconnect}
            className="navbar_navigationcontainer_useraddress"
          >
            {`${userAddress.slice(0, 4)}...${userAddress.slice(-4)}`}
          </div>
        ) : (
          <div
            onClick={() => {
              fcl.authenticate();
            }}
            className="navbar_navigationcontainer_connectwallet"
          >
            Connect Wallet
          </div>
        )}
        {/* <WalletDisconnectButton/> */}
      </div>
    </section>
  );
}
