import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import EventImage from "../../assets/roulette.svg";
import TagPurple from "../../assets/tag_purple.svg";
import Dropdown from "../../assets/dropdown.svg";
import Dropup from "../../assets/dropup.svg";
import Dice from "react-dice-roll";
import { Wheel } from "react-custom-roulette";
import * as fcl from "@onflow/fcl";

import "./EventPage.scss";
import EventModal from "../../components/EventModal/EventModal";
import CreateEventModal from "../../components/CreateEventModal/CreateEventModal";
import { useSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";
import FlowClient from "../../contracts/flowclient";

const data = [
  { option: "0", style: { backgroundColor: "#006900" } },
  { option: "32" },
  { option: "15" },
  { option: "19" },
  { option: "4" },
  { option: "21" },
  { option: "2" },
  { option: "25" },
  { option: "17" },
  { option: "34" },
  { option: "6" },
  { option: "27" },
  { option: "13" },
  { option: "36" },
  { option: "11" },
  { option: "30" },
  { option: "8" },
  { option: "23" },
  { option: "10" },
  { option: "5" },
  { option: "24" },
  { option: "16" },
  { option: "33" },
  { option: "1" },
  { option: "20" },
  { option: "14" },
  { option: "31" },
  { option: "9" },
  { option: "22" },
  { option: "18" },
  { option: "29" },
  { option: "7" },
  { option: "28" },
  { option: "12" },
  { option: "35" },
  { option: "3" },
  { option: "26" },
];

const backgroundColors = ["#1a1717", "#df3428"];
const textColors = ["white"];
const outerBorderColor = "#1a1717";
const outerBorderWidth = 9;
const innerBorderColor = "#1a1717";
const innerBorderWidth = 17;
const innerRadius = 40;
const radiusLineColor = "#d8a35a";
const radiusLineWidth = 3;
const fontSize = 20;
const textDistance = 86;
export default function RoulettePage() {
  const onClick = async () => {};
  const [mustSpin, setMustSpin] = useState(false);
  const [outcome, setOutcome] = useState(0);
  const [spinOutcome, setSpinOutcome] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [showLoading, setShowLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showOutcome, setShowOutcome] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

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

  const showErrorSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      preventDuplicate: true,
      autoHideDuration: 3000,
    });
  };
  const showSuccessSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      preventDuplicate: true,
      autoHideDuration: 3000,
    });
  };

  const cardData = {
    type: "Against the computer",
    name: "Beat the Roulette",
    volume: "49.2K",
    date: "May 31, 2023",
    icon: EventImage,
  };
  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    console.log("newPrizeNumber", newPrizeNumber);
    console.log("prize selected", data[newPrizeNumber].option);
    setOutcome(newPrizeNumber);
    setMustSpin(true);
  };
  const [selectedBet, setSelectedBet] = useState("");
  const [higherLowerInput, setHigherLowerInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const handleBetTypeClick = (betType) => {
    setSelectedBet(betType);
  };
  const validateForm = () => {
    if (selectedBet && amountInput) {
      if (selectedBet === "higher" || selectedBet === "lower") {
        higherLowerInput && setIsFormValid(true);
      } else setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };
  useEffect(() => {
    validateForm();
  }, [selectedBet, amountInput, higherLowerInput]);

  const handleHigherLowerInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || (inputValue >= 1 && inputValue <= 36)) {
      setHigherLowerInput(inputValue);
    } else {
      showErrorSnack("Value should be between 1 and 36");
    }
  };
  const handleAmountInputChange = (e) => {
    setAmountInput(e.target.value);
  };

  const handlePlaceBetClick = async () => {
    if (!currentUser) {
      showErrorSnack("Please connect your Flow wallet");
      return;
    }
    if (isFormValid) {
      setShowLoading(true);
      setShowLoading(true);
      let betType = selectedBet;
      if (selectedBet === "higher") betType = "high";
      if (selectedBet === "lower") betType = "low";
      let betNumber = higherLowerInput === "" ? 0 : parseInt(higherLowerInput);
      console.log(betType, higherLowerInput, amountInput, currentUser.addr);
      try {
        const res = await flowjs.roulette(
          betType,
          betNumber,
          amountInput,
          currentUser.addr
        );
        console.log(res);
        Object.values(res.events).forEach((event) => {
          if (event.type === flowjs.eventsList().roulettePublisherEvent) {
            setSpinOutcome(event.data);
            const resultIndex = data.findIndex(
              (item) => item.option === event.data.result
            );
            setOutcome(resultIndex);
            setShowLoading(false);
            setMustSpin(true);
          }
        });
        //   const _outcome = {
        //     address: "0x02f52a27fc97435a",
        //     result: "30",
        //     outcome: "won",
        //     type: "red",
        //   };

        //   setSpinOutcome(_outcome);
      } catch (err) {
        console.log(err);
        showErrorSnack("Could not create a bet");

        setShowLoading(false);
      }
      console.log("Selected Bet:", selectedBet);
      console.log("Higher/Lower Input:", higherLowerInput);
      console.log("Amount Input:", amountInput);
    } else {
      showErrorSnack("Please fill all the fields");
    }
  };
  return (
    <div className="event">
      <Navbar />
      <Loader showLoading={showLoading} />

      <div className="ellipse" />
      <div className="event_header">
        <div className="flex w-full gap-4">
          <div className="event_header_imagecontainer">
            <img className="w-32 h-32" src={cardData.icon} alt="event" />
          </div>
          <div className="event_header_detailscontainer">
            <div className="event_header_detailscontainer_name">
              {cardData.name}
            </div>
            <div className="event_header_detailscontainer_other">
              <div className="event_header_detailscontainer_other_label">
                {" "}
                {cardData.type}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="event_main pb-24">
        <div className="event_main_left">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={outcome}
            data={data}
            backgroundColors={backgroundColors}
            textColors={textColors}
            fontSize={fontSize}
            outerBorderColor={outerBorderColor}
            outerBorderWidth={outerBorderWidth}
            innerRadius={innerRadius}
            innerBorderColor={innerBorderColor}
            innerBorderWidth={innerBorderWidth}
            radiusLineColor={radiusLineColor}
            radiusLineWidth={radiusLineWidth}
            perpendicularText
            textDistance={textDistance}
            onStopSpinning={() => {
              setMustSpin(false);
              if (spinOutcome.outcome === "won") {
                showSuccessSnack("Hurray! You won the bet.");
              }
              if (spinOutcome.outcome === "lost") {
                showErrorSnack("Sorry! You lost the bet.");
              }
              setShowOutcome(spinOutcome);
            }}
          />
          <div
            className={`event_main_left_outcome ${
              showOutcome?.outcome === "won"
                ? "event_main_left_outcome_won"
                : ""
            } ${
              showOutcome?.outcome === "lost"
                ? "event_main_left_outcome_lost"
                : ""
            }`}
          >
            Outcome: {`${showOutcome?.result ? showOutcome?.result : ""}`}
          </div>
        </div>
        <div className="event_main_right">
          <div className="event_main_right_betcontainer">
            <div className="event_main_right_betcontainer_title">
              Make your move
            </div>

            <div className="event_main_right_betcontainer_container">
              <div className="event_main_right_betcontainer_container_title">
                Odd/Even
              </div>
              <div className="event_main_right_betcontainer_container_options">
                <div
                  className={`event_main_right_betcontainer_container_options_value odd ${
                    selectedBet === "odd" ? "selected" : ""
                  }`}
                  onClick={() => handleBetTypeClick("odd")}
                >
                  Odd
                </div>
                <div
                  className={`event_main_right_betcontainer_container_options_value even ${
                    selectedBet === "even" ? "selected" : ""
                  }`}
                  onClick={() => handleBetTypeClick("even")}
                >
                  Even
                </div>
              </div>
            </div>

            <div className="event_main_right_betcontainer_container">
              <div className="event_main_right_betcontainer_container_title">
                Red/Black
              </div>
              <div className="event_main_right_betcontainer_container_options">
                <div
                  className={`event_main_right_betcontainer_container_options_value red ${
                    selectedBet === "red" ? "selected" : ""
                  }`}
                  onClick={() => handleBetTypeClick("red")}
                >
                  Red
                </div>
                <div
                  className={`event_main_right_betcontainer_container_options_value black ${
                    selectedBet === "black" ? "selected" : ""
                  }`}
                  onClick={() => handleBetTypeClick("black")}
                >
                  Black
                </div>
              </div>
            </div>

            <div className="event_main_right_betcontainer_container">
              <div className="event_main_right_betcontainer_container_title">
                Higher/Lower
              </div>
              <div className="event_main_right_betcontainer_container_options">
                <input
                  className={`input ${
                    selectedBet === "higher" || "lower" ? "" : "disabled"
                  }`}
                  value={higherLowerInput}
                  onChange={handleHigherLowerInputChange}
                  disabled={selectedBet !== "higher" && selectedBet !== "lower"}
                />
                <div
                  className={`event_main_right_betcontainer_container_options_value higher ${
                    selectedBet === "higher" ? "selected" : ""
                  }`}
                  onClick={() => handleBetTypeClick("higher")}
                >
                  Higher
                </div>
                <div
                  className={`event_main_right_betcontainer_container_options_value lower ${
                    selectedBet === "lower" ? "selected" : ""
                  }`}
                  onClick={() => handleBetTypeClick("lower")}
                >
                  Lower
                </div>
              </div>
            </div>

            <div className="event_main_right_betcontainer_container event_main_right_betcontainer_container_amount">
              <div className="event_main_right_betcontainer_container_title">
                Amount
              </div>
              <div className="event_main_right_betcontainer_container_options">
                <input
                  className="input"
                  value={amountInput}
                  onChange={handleAmountInputChange}
                />
              </div>
            </div>

            <div className="event_main_right_betcontainer_container final">
              {`You have chosen`}{" "}
              <span>{`${selectedBet} ${
                selectedBet === "higher" || selectedBet === "lower"
                  ? `than ${higherLowerInput}`
                  : ""
              } outcome`}</span>{" "}
              for <span>{`${amountInput} FLOW`}</span>
            </div>
            <div
              onClick={handlePlaceBetClick}
              className="event_main_right_betcontainer_container button"
            >
              {`Try your luck`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
