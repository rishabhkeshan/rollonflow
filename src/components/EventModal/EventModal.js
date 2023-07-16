import React, { useState, useEffect, useRef } from "react";

import "./EventModal.scss";

function EventModal({ event, onClose }) {
  const tabsData = ["Add", "Reduce"];
  const isCoverActive = event.status === "Active";

  const handleToggle = () => {
    // Handle toggle logic here
  };
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const tabsRef = useRef([]);

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      setTabUnderlineLeft(currentTab?.offsetLeft - 30 ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth + 60 ?? 0);
    }

    setTabPosition();
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);
  const handleInputChange = (event) => {
    // Handle input change logic here
  };

  const handleAction = () => {
    // Handle add/remove event action here
  };

  return (
    <div className="cover_modal">
      <div className="cover_modal_content">
        <div className="cover_modal_header">
          <h2 className="cover_modal_header_title">Cover Details</h2>
          <button className="cover_modal_header_close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="cover_modal_body">
          <div className="cover_modal_body_top">
            <div className="cover_modal_body_top_left">
              <img
                className="cover_modal_body_top_left_image"
                src={event.icon}
                alt="event"
              />
              <div className="cover_modal_body_top_left_details">
                <div className="cover_modal_body_top_left_name">
                  {event.protocolName}
                </div>
                <div className="cover_modal_body_top_left_vulnerability">
                  {event.vulnerability}
                </div>
              </div>
            </div>
            <div className="cover_modal_body_top_right">
              <div className="cover_modal_body_top_right_details">
                <div className="cover_modal_body_top_right_details_key">
                  My Cover
                </div>
                <div className="cover_modal_body_top_right_details_value">
                  0.5 ETH
                </div>
              </div>
              {/* <div className="cover_modal_body_top_right_details">
                <div className="cover_modal_body_top_right_details_key"></div>
                <div className="cover_modal_body_top_right_details_value"></div>
              </div>
              <div className="cover_modal_body_top_right_details">
                <div className="cover_modal_body_top_right_details_key"></div>
                <div className="cover_modal_body_top_right_details_value"></div>
              </div> */}
            </div>
          </div>
          <div className="cover_modal_body_other">
            <div className="cover_modal_body_other_left">
              <div className="cover_modal_body_other_details">
                <div className="cover_modal_body_other_details_key">
                  My Cover
                </div>
                <div className="cover_modal_body_other_details_value">
                  0.5 ETH
                </div>
              </div>
              <div className="cover_modal_body_other_details">
                <div className="cover_modal_body_other_details_key">
                  My Cover
                </div>
                <div className="cover_modal_body_other_details_value">
                  0.5 ETH
                </div>
              </div>
              <div className="cover_modal_body_other_details">
                <div className="cover_modal_body_other_details_key">
                  My Cover
                </div>
                <div className="cover_modal_body_other_details_value">
                  0.5 ETH
                </div>
              </div>
            </div>
            <div className="cover_modal_body_other_right">
              <div className="cover_modal_body_other_details">
                <div className="cover_modal_body_other_details_key">
                  My Cover
                </div>
                <div className="cover_modal_body_other_details_value">
                  0.5 ETH
                </div>
              </div>
              <div className="cover_modal_body_other_details">
                <div className="cover_modal_body_other_details_key">
                  My Cover
                </div>
                <div className="cover_modal_body_other_details_value">
                  0.5 ETH
                </div>
              </div>
            </div>
          </div>
          <div className="cover_modal_body_inputcontainer">
            <div className=" cover_modal_body_inputcontainer_header">
              <div className=" cover_modal_body_inputcontainer_header_tabs">
                {console.log(tabsRef)}
                {tabsData.map((tab, idx) => {
                  const isActive = idx === activeTabIndex;
                  return (
                    <button
                      key={idx}
                      ref={(el) => (tabsRef.current[idx] = el)}
                      className={`pt-2 pb-1 ${isActive ? "active-tab" : ""}`}
                      onClick={() => setActiveTabIndex(idx)}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
              <span
                className="absolute bottom-0 block h-0.5 bg-teal-500 transition-all duration-300"
                style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
