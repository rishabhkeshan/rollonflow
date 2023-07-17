import React, { useState } from "react";
import "./LandingPage.scss";
import Navbar from "../../components/Navbar/Navbar";
import MarketsContainer from "../../components/GamesContainer/GamesContainer";
import { Link } from "react-router-dom";
import LandingBanner from "../../assets/landingbanner.svg";



export default function LandingPage() {

  return (
    <article className="landing">
      <Navbar />
      <section className="landing_main">
        <img
          src={LandingBanner}
          className="landing_main_banner"
          alt="landing banner"
        />
        <div className="landing_main_content">
          <div className="landing_main_content_markets">
            <div className="landing_main_content_markets_title">Games</div>
            <MarketsContainer />
          </div>
          {/* <div className="landing_main_content_footer">
            <div className="landing_main_content_footer_left">
              <Link to="/" className="landing_main_content_footer_left_logo">
                Roll on Flow
              </Link>
            </div>
            <div className="landing_main_content_footer_right">
              <div className="landing_main_content_footer_right_text">
                Join the community
              </div>
              <div className="landing_main_content_footer_right_socials">
                <Link to="/">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.8 3.71776C19.0716 4.04204 18.2875 4.26284 17.4669 4.36061C18.3036 3.85465 18.9486 3.05373 19.2521 2.09882C18.4687 2.56731 17.5979 2.9087 16.6737 3.09039C15.9324 2.296 14.8771 1.7998 13.7085 1.7998C11.4635 1.7998 9.64669 3.63059 9.64669 5.8883C9.64669 6.21014 9.68149 6.52056 9.75029 6.82039C6.37475 6.65093 3.38201 5.0222 1.37902 2.54858C1.02941 3.15313 0.828709 3.85464 0.828709 4.60504C0.828709 6.02355 1.58701 7.27504 2.67792 8.00914C2.01189 7.98633 0.878076 7.80381 0.878076 7.49746V7.54798C0.878076 9.52949 2.23686 11.1827 4.0958 11.5583C3.75509 11.6511 3.37554 11.7009 3.00407 11.7009C2.74347 11.7009 2.47804 11.6756 2.22877 11.6267C2.74591 13.2514 4.23985 14.4344 6.01947 14.4669C4.62831 15.5653 2.87459 16.2187 0.970334 16.2187C0.642574 16.2187 0.31805 16.1992 0 16.1601C1.79742 17.3219 3.93312 17.9998 6.22665 17.9998C13.6987 17.9998 17.7841 11.7668 17.7841 6.36413C17.7841 6.18569 17.78 6.0097 17.7719 5.83453C18.5666 5.25768 19.2537 4.53741 19.8 3.71776Z"
                      fill="white"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </article>
  );
}
