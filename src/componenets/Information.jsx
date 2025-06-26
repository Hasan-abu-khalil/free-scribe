import React, { useEffect, useRef, useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

function Information(props) {
  const { output } = props;
  const [tab, setTab] = useState("transcription");
  const [translation, setTranslation] = useState(null);
  const [toLanguage, setToLanguage] = useState("Select Language");
  const [translating, setTranslating] = useState(null);

  const worker = useRef();
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../utils/translate.worker.js", import.meta.url),
        {
          type: "module",
        }
      );

      const onMessageReceived = (e) => {
        switch (e.data.status) {
          case "initiate":
            console.log("DOWNLOADING");
            break;
          case "progress":
            console.log("LOADING");
            break;
          case "update":
            setTranslation(e.data.output);
            console.log(e.data.output);
            break;
          case "complete":
            setTranslating(false);
            console.log("DONE");
            break;
        }
      };

      worker.current.addEventListener("message", onMessageReceived);

      return () => {
        if (worker.current) {
          worker.current.removeEventListener("message", onMessageReceived);
        }
      };
    }
  }, []);

  const textElement =
    tab === "transcription"
      ? output.map((val) => val.text)
      : translation || "No translation";

  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([textElement], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `freescrib_${new Date().toString()}.txt`;
    document.body.appendChild(element);
    element.click();
  }

  function generaterTranslation() {
    if (translating || toLanguage === "Select Language") {
      return;
    }

    setTranslating(true);

    worker.current.postMessage({
      text: output.map((val) => val.text),
      src_lang: "eng_Latn",
      tgt_lang: toLanguage,
    });
  }

  return (
    <main
      className="flex-1 p-4 flex flex-col justify-center 
      pb-20 text-center gap-3 sm:gap-4 md:gap-5 max-w-prose w-full mx-auto"
    >
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        Your <span className="text-blue-400 bold">Transcription</span>
      </h1>

      <div className=" grid grid-cols-2 mx-auto bg-white border-2 border-solid border-slate-100 rounded-full overflow-hidden items-center ">
        <button
          onClick={() => setTab("transcription")}
          className={
            "px-4 py-1 duration-200 " +
            (tab === "transcription"
              ? "bg-blue-300 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
        >
          Transcription
        </button>

        <button
          onClick={() => setTab("translation")}
          className={
            "px-4 py-1 duration-200 " +
            (tab === "translation"
              ? "bg-blue-300 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
        >
          Translation
        </button>
      </div>

      <div className="my-8 flex flex-col">
        {tab === "transcription" ? (
          <Transcription {...props} textElement={textElement} />
        ) : (
          <Translation
            {...props}
            toLanguage={toLanguage}
            textElement={textElement}
            translating={translating}
            setTranslation={setTranslation}
            setTranslating={setTranslating}
            setToLanguage={setToLanguage}
            generaterTranslation={generaterTranslation}
          />
        )}
      </div>

      <div className="flex items-center gap-4 mx-auto ">
        <button
          onClick={handleCopy}
          title="Copy"
          className="bg-white text-blue-300 px2 aspect-square grid place-items-center rounded hover:text-blue-500 duration-200"
        >
          <i className="fa-solid fa-copy"></i>
        </button>
        <button
          onClick={handleDownload}
          title="Download"
          className="bg-white text-blue-300 px2 aspect-square grid place-items-center rounded hover:text-blue-500 duration-200"
        >
          <i className="fa-solid fa-download"></i>
        </button>
      </div>
    </main>
  );
}

export default Information;
