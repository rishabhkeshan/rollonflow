import React, { useState, useEffect, useRef } from "react";
import * as fcl from "@onflow/fcl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./CreateEventModal.scss";
import FlowClient from "../../contracts/flowclient";

function CreateEventModal({ event, onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    fcl.currentUser().subscribe((user) => {
      console.log("user", user);
      if (user.loggedIn) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);
  const flowjs = new FlowClient(currentUser);
  console.log(currentUser);
  console.log(fcl.currentUser);
  const [numDice, setNumDice] = useState(1);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [outcomeValue, setOutcomeValue] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const allOutcomes = ["<", "≤", "=", ">", "≥"];
  const totalDices = [1, 2, 3, 4, 5, 6];
  const [expiryDateTime, setExpiryDateTime] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  const minExpDate = new Date(new Date().setDate(new Date().getDate() + 1));

  const handleDiceClick = (diceValue) => {
    setNumDice(diceValue);
  };
  const handleDateChange = (e) => {
    setExpiryDateTime(e);
  };

  const handleOutcomeClick = (outcomeValue) => {
    setSelectedOutcome(outcomeValue);
  };
  const handleOutcomeValueChange = (event) => {
    setOutcomeValue(event.target.value);
  };

  const calculateMinValue = () => {
    return numDice;
  };

  const calculateMaxValue = () => {
    return numDice * 6;
  };
  const handleBetAmountChange = (e) => {
    setBetAmount(e.target.value);
  };
  const handleCreateEvent = async () => {
    // try {
      const res = await flowjs.createDiceEvent(
        numDice,
        outcomeValue,
        "<",
        1000.0,
        100.0,
        currentUser.addr
      );
      // console.log(res);
      console.log(res);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div className="createmodal">
      <div className="createmodal_content">
        <div className="createmodal_header">
          <h2 className="createmodal_header_title">Create Event</h2>
          <button className="createmodal_header_close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="createmodal_body">
          <div className="createmodal_body_container">
            <div className="createmodal_body_container_title">No. of Dices</div>
            <div className="createmodal_body_container_options">
              {totalDices.map((diceValue) => (
                <div
                  key={diceValue}
                  className={`createmodal_body_container_options_value ${
                    numDice === diceValue ? "selected" : ""
                  }`}
                  onClick={() => handleDiceClick(diceValue)}
                >
                  {diceValue}
                </div>
              ))}
            </div>
          </div>
          <div className="createmodal_body_container">
            <div className="flex flex-col">
              <div className="createmodal_body_container_title">Outcome</div>
              <div className="createmodal_body_container_subtitle">{`Value can range between ${calculateMinValue()} and ${calculateMaxValue()}`}</div>
            </div>
            <div className="createmodal_body_container_optionsout">
              {allOutcomes.map((outcomeValue) => (
                <div
                  key={outcomeValue}
                  className={`createmodal_body_container_optionsout_value ${
                    selectedOutcome === outcomeValue ? "selected" : ""
                  }`}
                  onClick={() => handleOutcomeClick(outcomeValue)}
                >
                  {outcomeValue}
                </div>
              ))}
              <input
                type="number"
                className="createmodal_body_container_optionsout_value"
                value={outcomeValue}
                onChange={handleOutcomeValueChange}
                min={calculateMinValue()}
                max={calculateMaxValue()}
              />
            </div>
          </div>
          <div className="createmodal_body_container">
            <div className="createmodal_body_container_title">
              Amount to Bet
            </div>
            <div className="createmodal_body_container_optionsamount">
              <input
                type="number"
                value={betAmount}
                onChange={handleBetAmountChange}
                className="createmodal_body_container_optionsamount_value"
              />
              <div className="createmodal_body_container_optionsamount_value">{`FLOW`}</div>
            </div>
          </div>
          <div className="createmodal_body_container">
            <div className="createmodal_body_container_title">
              Expiry Date & Time
            </div>
            <div className="createmodal_body_container_options">
              <DatePicker
                name="closeDateTime"
                selected={expiryDateTime}
                dateFormat="yyyy-MM-dd HH:mm"
                onChange={handleDateChange}
                minDate={minExpDate}
                showTimeSelect
                className="createmodal_body_container_options_value"
              />
            </div>
          </div>
          <div className="createmodal_body_submitcontainer">
            <div
              onClick={handleCreateEvent}
              className="createmodal_body_submitcontainer_button"
            >
              Create Event
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEventModal;
