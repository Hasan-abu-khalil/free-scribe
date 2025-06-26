import React from "react";

function FileDisplay(props) {
  const { handleAudioReset, file, audioStream, handleFormSubmission } = props;

  return (
    <main
      className="flex-1 p-4 flex flex-col justify-center w-75
      pb-20 text-center gap-3 sm:gap-4 md:gap-5 max-w-full mx-auto"
    >
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">
        Your <span className="text-blue-400 bold">File</span>
      </h1>
      <div className="  flex flex-col text-left gap-2 my-4">
        <h3 className="sont-semilbold">Name</h3>
        <p>{file ? file.name : "Custom audio"}</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleAudioReset}
          className="text-slate-400 hover:text-blue-600 duration-200"
        >
          Reset
        </button>
        <button
          onClick={handleFormSubmission}
          className="specialBtn p-2 px-3 rounded-lg text-blue-400 flex items-center gap-2 font-medium"
        >
          <p>Transcribe</p>
          <i className="fa-solid fa-pen-nib"></i>
        </button>
      </div>
    </main>
  );
}

export default FileDisplay;
