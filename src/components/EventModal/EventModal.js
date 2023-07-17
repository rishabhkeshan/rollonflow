import React, { useState, useEffect, useRef } from "react";
import Dice from "react-dice-roll";

import "./EventModal.scss";

function EventModal({ event, onClose }) {
  const numDices = [6];
  const handleToggle = () => {
    // Handle toggle logic here
  };
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
          <h2 className="cover_modal_header_title">Outcome</h2>
          <button className="cover_modal_header_close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="cover_modal_body">
          <div className="cover_modal_body_dicecontainer">
            {numDices.map((dice, index) => (
              <Dice onRoll={(value) => console.log(value)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
