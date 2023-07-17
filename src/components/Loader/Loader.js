import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import flow from "../../assets/flow.svg";

export default function Loader({ showLoading }) {
  return (
    <Modal
      open={showLoading}
      aria-labelledby="loader"
      aria-describedby="loading"
      className="align-middle justify-center items-center outline-none justify-items-center flex h-screen bg-black bg-opacity-50"

    >
      <div className="outline-none">
        <img
          alt="logo"
          src={flow}
          className="animate-pulse w-auto align-middle justify-center m-auto"
        />
      </div>
    </Modal>
  );
}
