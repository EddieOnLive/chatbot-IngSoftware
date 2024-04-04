import "./App.css";
import ChatBot from "react-simple-chatbot";
import "react-chatbot-kit/build/main.css";
import ExampleDBPedia from "./Prueba";

function App() {
  return (
    <>
      <div className="bg-slate-800 flex justify-center">
        <div className="mt-10">
          <div className="">
            <ExampleDBPedia></ExampleDBPedia>
            {/* <ChatBot
              steps={[
                {
                  id: "hello-world",
                  message:
                    "En este momento no puedo contestar, intenta de nuevo más tarde!",
                  end: true,
                },
              ]}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
