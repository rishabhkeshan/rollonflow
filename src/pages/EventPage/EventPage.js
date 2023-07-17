import React, { useCallback, useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";
import Navbar from "../../components/Navbar/Navbar";
import EventImage from "../../assets/event_image.svg";
import TagPurple from "../../assets/tag_purple.svg";
import Dropdown from "../../assets/dropdown.svg";
import Dropup from "../../assets/dropup.svg";
import Dice from "react-dice-roll";
import FlowClient from "../../contracts/flowclient";


import "./EventPage.scss";
import EventModal from "../../components/EventModal/EventModal";
import CreateEventModal from "../../components/CreateEventModal/CreateEventModal";

export default function EventPage() {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
      fcl.currentUser().subscribe(async (user) => {
        console.log("user", user);
        if (user.loggedIn) {
          let orderBookData = []
          setCurrentUser(user);
          const flowjs = new FlowClient(user);
          const res = await flowjs.getAllEvents();
          console.log(res)
          Object.values(res).forEach((res) => {
            var date = new Date(parseFloat(res.expiry * 1000))
            const obj = {
              walletAddress: res.eventCreator,
              numberOfDices: res.numberOfDices,
              outcomeType: `${res.operator} ${res.eventNumeric}`,
              betAmount: `${parseFloat(res.funds)} FLOW`,
              expiryDateTime: date.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }).replaceAll("/", "."),
              blockHeight: 123456,
              betAgainst: "Bet Against",
            }
            orderBookData.push(obj)
          })
          setAllEvents(orderBookData)
        } else {
          setCurrentUser(null);
        }
      });

    }, []);
  const [allEvents, setAllEvents] = useState([]);
  const onClick = async () => {};
  const cardData = {
    type: "Multi user",
    name: "Roll the Dice",
    volume: "49.2K",
    date: "May 31, 2023",
    icon: EventImage,
  };
  const orderBookData = [
    {
      walletAddress: "0x1a0a4f79f7cbbb635d5a6f2f49e2f11f",
      numberOfDices: 2,
      outcomeType: "> 7",
      betAmount: "0.5 FLOW",
      expiryDateTime: "2023-07-20 10:30",
      blockHeight: 123456,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x3c2545d87e10f7f9c42b8c55791e0d1e",
      numberOfDices: 3,
      outcomeType: "> 4",
      betAmount: "1.2 FLOW",
      expiryDateTime: "2023-07-21 15:45",
      blockHeight: 123457,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x6d3b4e2a17599e3f1f775e413e1dd2b6",
      numberOfDices: 1,
      outcomeType: "≥ 8",
      betAmount: "0.8 FLOW",
      expiryDateTime: "2023-07-22 09:00",
      blockHeight: 123458,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x47c3cdd89dcd2a2d673ed12e8a3cbbd8",
      numberOfDices: 2,
      outcomeType: "> 7",
      betAmount: "0.3 FLOW",
      expiryDateTime: "2023-07-23 13:15",
      blockHeight: 123459,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x98ff4d9a7bdc7db91a6d51e2d184e6b5",
      numberOfDices: 3,
      outcomeType: "> 4",
      betAmount: "0.9 FLOW",
      expiryDateTime: "2023-07-24 11:30",
      blockHeight: 123460,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x817f03668287af4fcfaab2ac4d64dc0c",
      numberOfDices: 1,
      outcomeType: "≤ 8",
      betAmount: "0.7 FLOW",
      expiryDateTime: "2023-07-25 16:45",
      blockHeight: 123461,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x24df8a19530c48794e0912a6a23412bb",
      numberOfDices: 2,
      outcomeType: "> 7",
      betAmount: "0.4 FLOW",
      expiryDateTime: "2023-07-26 14:00",
      blockHeight: 123462,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x7f9e5a193fb3f4aace7eb537dc30b7a9",
      numberOfDices: 3,
      outcomeType: "≤ 4",
      betAmount: "1.5 FLOW",
      expiryDateTime: "2023-07-27 09:15",
      blockHeight: 123463,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x33a24c5bca3f6eb7dfb4b61662177a2f",
      numberOfDices: 1,
      outcomeType: "≤ 8",
      betAmount: "0.6 FLOW",
      expiryDateTime: "2023-07-28 12:30",
      blockHeight: 123464,
      betAgainst: "Bet Against",
    },
    {
      walletAddress: "0x4f212f7a4db34c1bdf63673f7c7dbb33",
      numberOfDices: 2,
      outcomeType: "> 7",
      betAmount: "0.8 FLOW",
      expiryDateTime: "2023-07-29 10:45",
      blockHeight: 123465,
      betAgainst: "Bet Against",
    },
  ];
  const [YesNoActive, setYesNoActive] = useState("yes");

  const handleButtonClick = (button) => {
    setYesNoActive(button);
  };
  const [showMore, setShowMore] = useState(false);

  const handleShowToggle = () => {
    setShowMore(!showMore);
  };
  const getShortenedAddress = (address) => {
    const firstFour = address.substring(0, 6);
    const lastFour = address.substring(address.length - 4);
    return `${firstFour}...${lastFour}`;
  };
  const numberOfDices = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);


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
        <div className="event_header_right">
          <div onClick={()=>setIsCreateOpen(true)} className="event_header_right_button">Create Event +</div>
        </div>
      </div>
      <div className="event_main">
        <div className="event_main_cardscontainer">
          {allEvents.map((order, id) => (
            <div key={id} className="event_main_cardscontainer_card">
              <div className="event_main_cardscontainer_card_left">
                <div className="event_main_cardscontainer_card_left_text">
                  Against
                </div>
                <div className="event_main_cardscontainer_card_left_value">
                  {order.outcomeType}
                </div>
              </div>
              <div className="event_main_cardscontainer_card_right">
                <div className="event_main_cardscontainer_card_right_box">
                  <div className="event_main_cardscontainer_card_right_box_text">
                    No. of Dices:
                  </div>
                  <div className="event_main_cardscontainer_card_right_box_value">
                    {order.numberOfDices}
                  </div>
                </div>
                <div className="event_main_cardscontainer_card_right_box">
                  <div className="event_main_cardscontainer_card_right_box_text">
                    Amount:
                  </div>
                  <div className="event_main_cardscontainer_card_right_box_value">
                    {order.betAmount}
                  </div>
                </div>
                <div className="event_main_cardscontainer_card_right_box">
                  <div className="event_main_cardscontainer_card_right_box_text">
                    Expiry Time:
                  </div>
                  <div className="event_main_cardscontainer_card_right_box_value">
                    {order.expiryDateTime}
                  </div>
                </div>
                <div
                  onClick={() => handleCardClick(order)}
                  className="event_main_cardscontainer_card_right_box_roll"
                >
                  Roll
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedCard && (
        <EventModal
          event={selectedCard}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isCreateOpen && (<CreateEventModal onClose={()=>setIsCreateOpen(false)}/>)}
    </div>
  );
}
