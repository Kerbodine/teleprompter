import { useRef, useState, useEffect } from "react";
import stringSimilarity from "string-similarity";

const cleanWord = (word) =>
  word
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z]/gi, "");

export default function Teleprompter({ words, progress, listening, onChange }) {
  const recog = useRef(null);
  const scrollRef = useRef(null);
  const [results, setResults] = useState("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recog.current = new SpeechRecognition();
    recog.current.continuous = true;
    recog.current.interimResults = true;
  }, []);

  useEffect(() => {
    if (listening) {
      recog.current.start();
    } else {
      recog.current.stop();
    }
  }, [listening]);

  useEffect(() => {
    const handleResult = ({ results }) => {
      const interim = Array.from(results)
        .filter((r) => !r.isFinal)
        .map((r) => r[0].transcript)
        .join(" ");
      setResults(interim);

      const newIndex = interim.split(" ").reduce((memo, word) => {
        if (memo >= words.length) {
          return memo;
        }
        const similarity = stringSimilarity.compareTwoStrings(
          cleanWord(word),
          cleanWord(words[memo])
        );
        memo += similarity > 0.3 ? 1 : 0; // sensitivity
        return memo;
      }, progress);
      if (newIndex > progress && newIndex <= words.length) {
        onChange(newIndex);
      }
    };
    recog.current.addEventListener("result", handleResult);
    return () => {
      recog.current.removeEventListener("result", handleResult);
    };
  }, [onChange, progress, words]);

  useEffect(() => {
    scrollRef.current
      .querySelector(`[data-index='${progress + 8}']`) // pre-scroll
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        // block: "start",
        inline: "start",
      });
  }, [progress]);

  return (
    <>
      <div
        className="text-5xl w-full h-[calc(100vh-338px)] overflow-y-scroll scroll-smooth block mb-2 pb-16"
        ref={scrollRef}
      >
        {words.map((word, i) => (
          <span
            key={`${word}:${i}`}
            data-index={i}
            style={{
              color: i < progress ? "#aaa" : "#000",
            }}
          >
            {word}{" "}
          </span>
        ))}
      </div>
      <hr className="h-[2px] bg-gray-200 border-none mb-4" />
      {results && <div className="text-gray-600">{results}</div>}
    </>
  );
}
