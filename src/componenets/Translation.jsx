import React from "react";
import { LANGUAGES } from "../utils/presets";

function Translation(props) {
  const {
    textElement,
    toLanguage,
    translating,
    setToLanguage,
    generaterTranslation,
  } = props;

  return (
    <div className="flex flex-col gap-2 max-w-[400] w-full mx-auto">
      {!translating && (
        <div className="flex flex-col gap-1 ">
          <p className=" text-xs sm:text-sm font-medium text-slate-500 mr-auto"></p>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <select
              value={toLanguage}
              onChange={(e) => setToLanguage(e.target.value)}
              className="w-full sm:flex-1  border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-300 p-2 rounded text-sm transition-all"
            >
              <option value="Select Language">Select Language</option>
              {Object.entries(LANGUAGES).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>

            <button
              onClick={generaterTranslation}
              className="w-full sm:w-auto  text-blue-500  hover:text-blue-600 border border-blue-400 px-4 py-2 rounded transition-colors text-sm"
            >
              Translate
            </button>
          </div>
        </div>
      )}

      {textElement && !translating && <p>{textElement}</p>}

      {translating && (
        <div className="grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin"></i>
        </div>
      )}
    </div>
  );
}

export default Translation;
