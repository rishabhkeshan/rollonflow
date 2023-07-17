import React, { useState, useEffect, useRef } from "react";
import * as fcl from "@onflow/fcl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./CreateEventModal.scss";
import FlowClient from "../../contracts/flowclient";
import { useSnackbar } from "notistack";
import Loader from "../Loader/Loader";

function CreateEventModal({ event, onClose }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoading, setShowLoading] = useState(false);

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
  const [numDice, setNumDice] = useState(1);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [outcomeValue, setOutcomeValue] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const allOutcomes = ["<", "≤", "=", ">", "≥"];
  const totalDices = [1, 2, 3, 4, 5, 6];
  const [expiryDateTime, setExpiryDateTime] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  const minExpDate = new Date(new Date().setDate(new Date().getDate() + 1));
  const { enqueueSnackbar } = useSnackbar();
  const showErrorSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      preventDuplicate: true,
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };
  const showSuccessSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      preventDuplicate: true,
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

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
    const value = event.target.value;
    const minValue = calculateMinValue();
    const maxValue = calculateMaxValue();

    if (value === "" || (value >= minValue && value <= maxValue)) {
      setOutcomeValue(value);
    } else {
      showErrorSnack(
        `Please enter a value between ${minValue} and ${maxValue}`
      );
    }
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
  const validateForm = () => {
    // Check if all fields are filled
    if (
      numDice &&
      selectedOutcome &&
      outcomeValue &&
      betAmount &&
      expiryDateTime
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };
  const handleCreateEvent = async () => {
    if (isFormValid) {
      setShowLoading(true);

      let operator = selectedOutcome;
      if (selectedOutcome === "≤") {
        operator = "<=";
      } else if (selectedOutcome === "≥") {
        operator = ">=";
      }
      const eventCloseTime = Math.floor(
        (expiryDateTime.getTime() - new Date().getTime()) / 1000
      );
      try {
        const res = await flowjs.createDiceEvent(
          numDice,
          outcomeValue,
          operator,
          eventCloseTime,
          betAmount,
          currentUser.addr
        );

        showSuccessSnack("Event created successfully");
        onClose();
        setShowLoading(false);
      } catch (err) {
        console.log(err);      
        showErrorSnack("Could not create an event");

        setShowLoading(false);
      }
    } else {
      showErrorSnack("Please fill all the fields");
    }
  };

  useEffect(() => {
    validateForm();
  }, [numDice, selectedOutcome, outcomeValue, betAmount, expiryDateTime]);

  return (
    <div className="createmodal">
      <Loader showLoading={showLoading} />

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
