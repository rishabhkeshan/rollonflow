import React, { useState, useEffect, useRef } from "react";
import Dice from "react-dice-roll";

import "./EventModal.scss";

function EventModal({ event, onClose }) {
  const [diceContainerClass, setDiceContainerClass] = useState(
    "cover_modal_body_dicecontainer_2x3"
  );
  const [numDices, setNumDices] = useState([
    { value: 2, disabled: false },
    { value: 5, disabled: false },
    { value: 6, disabled: false },
  ]);
  const [rollTime, setRollTime] = useState(1000);

  const operator = "<";
  const outcomeValue = 12;
  const [winningOutcome, setWinningOutcome] = useState(null);
  const [calculatedOutcome, setCalculatedOutcome] = useState(0);
  const bet = () => {
    const diceButtons = document.querySelectorAll("#dice-wrapper button");
    diceButtons.forEach((button) => button.click());
    setRollTime(1000);
    setTimeout(() => {
      calculateOutcome();
    }, 1100);
  };
  useEffect(() => {
    if (numDices.length === 5 || numDices.length === 6) {
      setDiceContainerClass("cover_modal_body_dicecontainer_3x2");
    } else if (numDices.length <= 2) {
      setDiceContainerClass("cover_modal_body_dicecontainer_1x2");
    } else {
      setDiceContainerClass("cover_modal_body_dicecontainer_2x3");
    }
  }, [numDices]);

  const calculateOutcome = () => {
    const summation = numDices.reduce((total, dice) => total + dice.value, 0);
    let outcome = false;
    console.log(summation);
    if (operator === "<") {
      outcome = summation >= outcomeValue;
    } else if (operator === "<=") {
      outcome = summation > outcomeValue;
    } else if (operator === ">") {
      outcome = summation <= outcomeValue;
    } else if (operator === ">=") {
      outcome = summation < outcomeValue;
    } else if (operator === "=") {
      outcome = summation !== outcomeValue;
    }
    setCalculatedOutcome(summation);
    setWinningOutcome(outcome);
    console.log(outcome);
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
          <div
            className={`cover_modal_body_outcometext ${
              winningOutcome === true
                ? "cover_modal_body_outcometext_won"
                : winningOutcome === false
                ? "cover_modal_body_outcometext_lost"
                : ""
            }`}
          >
            {winningOutcome === true && "Hurray you won!"}
            {winningOutcome === false && "Sorry you lost!"}
            {winningOutcome === null && ""}
          </div>

          <div
            id="dice-wrapper"
            className={`cover_modal_body_dicecontainer ${diceContainerClass} ${
              winningOutcome === true
                ? "cover_modal_body_dicecontainer_won"
                : winningOutcome === false
                ? "cover_modal_body_dicecontainer_lost"
                : ""
            }`}
          >
            {numDices.map((dice, index) => (
              <Dice
                rollingTime={rollTime}
                size={180}
                disabled={dice.disabled}
                cheatValue={dice.value}
                onRoll={(value) => console.log(value)}
              />
            ))}
          </div>
          <button onClick={bet}>bet</button>
          <div className="cover_modal_body_textcontainer cover_modal_body_textcontainer_margin">
            <div className="cover_modal_body_textcontainer_text">
              Your winning outcome:
            </div>
            {operator === "<" ? (
              <div className="cover_modal_body_textcontainer_value">
                {`>=`} {outcomeValue}
              </div>
            ) : operator === "<=" ? (
              <div className="cover_modal_body_textcontainer_value">
                {`>`} {outcomeValue}
              </div>
            ) : operator === ">" ? (
              <div className="cover_modal_body_textcontainer_value">
                {`<=`} {outcomeValue}
              </div>
            ) : operator === ">=" ? (
              <div className="cover_modal_body_textcontainer_value">
                {`<`} {outcomeValue}
              </div>
            ) : operator === "=" ? (
              <div className="cover_modal_body_textcontainer_value">
                {`!=`} {outcomeValue}
              </div>
            ) : null}{" "}
          </div>
          <div className="cover_modal_body_textcontainer">
            <div className="cover_modal_body_textcontainer_text">
              Dice outcome:
            </div>
            <div
              className={`cover_modal_body_textcontainer_value ${
                winningOutcome
                  ? "cover_modal_body_textcontainer_value_won"
                  : winningOutcome === false
                  ? "cover_modal_body_textcontainer_value_lost"
                  : ""
              }`}
            >
              {calculatedOutcome}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
