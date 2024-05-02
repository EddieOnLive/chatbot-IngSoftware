import "./App.css";
import "react-chatbot-kit/build/main.css";
import ExampleDBPedia from "./Prueba";

function App() {
  return (
    <>
      <div className="bg-slate-800 flex justify-center">
        <div className="mt-10">
          <div className="">
            <ExampleDBPedia></ExampleDBPedia>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
