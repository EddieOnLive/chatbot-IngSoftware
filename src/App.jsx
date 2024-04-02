import { useState } from "react";
import ChatBot from "react-simple-chatbot";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-slate-800 flex justify-center">
        <div>
          <ChatBot
            steps={[
              {
                id: "hello-world",
                message: "Hello World!",
                end: true,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default App;
