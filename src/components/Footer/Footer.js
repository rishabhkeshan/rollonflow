import "./Footer.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import flow from "../../assets/flow.svg";

export default function Footer() {
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const routePath = location.pathname;
  // useEffect(() => {
  //   if (
  //     routePath === "/signup" ||
  //     routePath === "/login" ||
  //     routePath === "/verify" ||
  //     routePath === "/wallet-create"
  //   ) {
  //     setVisible(false);
  //     console.log("hi");
  //   } else setVisible(true);
  // }, [location]);

  return visible ? (
    <div className="footer">
      <div className="footer_left">
        Powered by <img src={flow} alt="flow" />
      </div>
      <div className="footer_left">
        {" "}
        Made with ❤️ by{" "}
        <a
          rel="noreferrer"
          target="_blank"
          href="https://devfolio.com/rishabhkeshan"
          className="px-1 underline"
        >
          Team 30PercentTax
        </a>
      </div>
    </div>
  ) : (
    <></>
  );
}
