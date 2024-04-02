import { useState } from "react";
import "./App.css";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "./configs/chatbotConfig";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";

function App() {
  return (
    <>
      <div className="bg-slate-800 flex justify-center">
        <div className="mt-10">
          <div className="">
            <Chatbot
              className
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
