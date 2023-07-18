import React, { useEffect, useRef, useState } from "react";
import BookmarkEmpty from "../../assets/bookmark_empty.svg";
import Dice from "../../assets/dice.svg";
import Roulette from "../../assets/roulette.svg";
import "./GamesContainer.scss";
import { Link } from "react-router-dom";

export default function MarketsContainer() {
  const cardsData = [
    {
      type: "Multi user",
      name: "Roll the Dice",
      text: "Do the flow blocks, sorry gods favour you? Bet your chances against the dices!",
      volume: "723 FLOW",
      date: "May 31, 2023",
      icon: Dice,
      path: "rollthedice"
    },
    {
      type: "Against the computer",
      name: "Beat the Roulette",
      text: "Red or Black, Odd or Even, Lucky Number 7 or is it 29? Find yours now!",
      volume: "900 FLOW",
      date: "May 31, 2023",
      icon: Roulette,
      path:"beattheroulette"
    },
  ];

  return (
    <>
      <div className="markets_main_cardscontainer">
        <div className="markets_main_cardscontainer_cards">
          {cardsData.map((card, id) => {
            return (
              <Link
                to={`/games/${card.path}`}
                className="markets_main_cardscontainer_card"
              >
                <div className="markets_main_cardscontainer_card_content">
                  <div className="markets_main_cardscontainer_card_content_top">
                    <div className="markets_main_cardscontainer_card_content_top_left">
                      <div className="markets_main_cardscontainer_card_content_top_left_tagcontainer">
                        <div className="markets_main_cardscontainer_card_content_top_left_tagcontainer_label">
                          {card.type}
                        </div>
                        <img
                          className="w-5"
                          src={BookmarkEmpty}
                          alt="Empty Bookmark"
                        />
                      </div>
                      <div className="markets_main_cardscontainer_card_content_top_left_namecontainer">
                        {card.name}
                      </div>
                      <div className="markets_main_cardscontainer_card_content_top_left_textcontainer">
                        {card.text}
                      </div>
                    </div>
                    <div className="markets_main_cardscontainer_card_content_top_right">
                      <img
                        className="w-full"
                        src={card.icon}
                        alt="eventImage"
                      />
                    </div>
                  </div>
                </div>
                <div className="markets_main_cardscontainer_card_footer">
                  <div className="markets_main_cardscontainer_card_footer_left">
                    <div className="markets_main_cardscontainer_card_footer_left_detail">
                      $ {card.volume}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
