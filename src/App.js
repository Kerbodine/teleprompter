import { useState } from "react";
import Teleprompter from "./Teleprompter";
const INITIAL_TEXT = `This is a test to see how things work. This should scroll as you approach the next word. If all goes well you can talk and it will move along.`;

export default function App() {
  const [listening, setListening] = useState(false);
  const [words, setWords] = useState(INITIAL_TEXT.split(" "));
  const [progress, setProgress] = useState(0);

  const handleInput = (e) => {
    setWords(e.target.value.split(" "));
    progress && setProgress(0);
  };

  const handleListening = () => {
    if (listening) {
      setListening(false);
    } else {
      setProgress(0);
      setListening(true);
    }
  };

  const handleReset = () => setProgress(0);

  const handleChange = (progress) => setProgress(progress);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="mx-auto max-w-4xl mt-8">
        <div className="flex flex-col mb-1">
          <textarea
            className="h-[5rem] border-2 border-gray-200 rounded-md mb-1 w-full outline-none focus:border-gray-600 px-1.5 py-1 transition-colors"
            onChange={handleInput}
            value={words.join(" ")}
          />
          <div className="flex gap-2 my-4">
            <button
              className="inline-block py-1.5 px-4 bg-gray-200 hover:bg-gray-600 hover:text-white text-center rounded-md transition-colors"
              onClick={handleListening}
            >
              {listening ? "Stop" : "Start"}
            </button>
            <button
              className="inline-block py-1.5 px-4 border-2 border-gray-200 text-center rounded-md hover:border-gray-600 text-gray-600 font-medium transition-colors"
              onClick={handleReset}
              disabled={listening}
              secondary
            >
              Reset
            </button>
          </div>
        </div>
        <hr className="h-[2px] bg-gray-200 border-none mb-4" />
        <Teleprompter
          words={words}
          listening={listening}
          progress={progress}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
