import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import EventImage from "../../assets/roulette.svg";
import TagPurple from "../../assets/tag_purple.svg";
import Dropdown from "../../assets/dropdown.svg";
import Dropup from "../../assets/dropup.svg";
import Dice from "react-dice-roll";
import { Wheel } from "react-custom-roulette";


import "./EventPage.scss";
import EventModal from "../../components/EventModal/EventModal";
import CreateEventModal from "../../components/CreateEventModal/CreateEventModal";

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
    const [prizeNumber, setPrizeNumber] = useState(0);
    
  const cardData = {
    type: "Against the computer",
    name: "Beat the Roulette",
    volume: "49.2K",
    date: "May 31, 2023",
    icon: EventImage,
  };
  const handleSpinClick = () => {
    // The Wheel component will call this function when spin is clicked
    // The next line will set the prize number to a random number between 0 and end of data array(which will be no. of questions)
    // You can then access the question number(option name) through indexing(newPrizeNumber is the index value).
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    console.log("newPrizeNumber", newPrizeNumber);
    console.log("prize selected", data[newPrizeNumber].option);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <div className="event">
      <Navbar />
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
              <div className="event_header_detailscontainer_other_detail">
                $ {cardData.volume}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="event_main">
        <div className="event_main_left">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
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
            }}
          />
          <button className={"spin-button"} onClick={handleSpinClick}>
            SPIN
          </button>
        </div>
      </div>
    </div>
  );
}
