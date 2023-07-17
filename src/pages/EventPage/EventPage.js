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
import { useSnackbar } from "notistack";
import Loader from "../../components/Loader/Loader";

export default function EventPage() {
  const [currentUser, setCurrentUser] = useState(null);

  const [showLoading, setShowLoading] = useState(false);

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

  useEffect(() => {
    fcl.currentUser().subscribe(async (user) => {
      console.log("user", user);
      if (user.loggedIn) {
        setShowLoading(true);

        let orderBookData = [];
        setCurrentUser(user);
        const flowjs = new FlowClient(user);
        const response = await flowjs.getAllEvents();
        console.log(response);
        response.forEach((res) => {
          var date = new Date(parseFloat(res.expiry * 1000));
          if (res.operator === "<=") {
            res.operator = "≤";
          } else if (res.operator === ">=") {
            res.operator = "≥";
          }
          const obj = {
            id: res.id,
            walletAddress: res.eventCreator,
            numberOfDices: res.numberOfDices,
            outcomeType: `${res.operator} ${res.eventNumeric}`,
            funds: parseFloat(res.funds).toFixed(1),
            betAmount: `${parseFloat(res.funds)} FLOW`,
            expiryDateTime: date
              .toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replaceAll("/", "."),
            blockHeight: 123456,
            betAgainst: "Bet Against",
          };
          orderBookData.push(obj);
        });

        setAllEvents(orderBookData);
        setShowLoading(false);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);
  const flowjs = new FlowClient(currentUser);

  const [allEvents, setAllEvents] = useState([]);
  const onClick = async () => {};
  const cardData = {
    type: "Multi user",
    name: "Roll the Dice",
    volume: "49.2K",
    date: "May 31, 2023",
    icon: EventImage,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = async (card) => {
    setShowLoading(true);

    setSelectedCard(card);
    console.log(card);
    listener(card.id);

    try {
      const res = await flowjs.roll(card.id, card.funds, currentUser.addr);
      showSuccessSnack("Bet successfull...Rolling the Dices");

      Object.values(res.events).forEach((event) => {
        if (event.type === flowjs.eventsList().rollPublisherEvent) {
          const outcomeData = {
            outcome: event.data.outcome,
            summationValue: event.data.summationValue,
          };
          if (event.data.outcome === "won") {
            console.log("jeet gaya");
          } else {
            console.log("haar gaya");
          }
        }
      });
      setShowLoading(false);
    } catch (err) {
      console.log(err);
      showErrorSnack("Could not place the bet");
      setShowLoading(false);
    }

    // setIsModalOpen(true);
  };
  const listener = (id) => {
    console.log(flowjs.eventsList());
    console.log(flowjs.eventsList().rollPublisherEvent);
    fcl
      .events(flowjs.eventsList().rollPublisherEvent)
      .subscribe((eventData) => {
        console.log(eventData);
        if (eventData.id === parseFloat(id)) {
          if (eventData.outcome === "won") {
            console.log("jeet gaya");
          }
        }
      });
  };
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
              <div className="event_header_detailscontainer_other_detail">
                $ {cardData.volume}
              </div>
            </div>
          </div>
        </div>
        <div className="event_header_right">
          <div
            onClick={() => setIsCreateOpen(true)}
            className="event_header_right_button"
          >
            Create Event +
          </div>
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
      {isCreateOpen && (
        <CreateEventModal onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
}
