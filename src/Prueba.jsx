/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import ChatBot from "react-simple-chatbot";
import WikiSearch from "./WikiSearch2";


function Prueba() {
  return (
    <div>
      <ChatBot
    steps={[
      {
        id: "1",
        message: "Escribe algo para buscar en Wikipedia (en español)",
        trigger: "search",
      },
      {
        id: "search",
        user: true,
        trigger: "3",
      },
      {
        id: "3",
        component: <WikiSearch />,
        waitAction: true,
        trigger: "1",
      },
    ]}
  />
    </div>
  )
}

export default Prueba;


