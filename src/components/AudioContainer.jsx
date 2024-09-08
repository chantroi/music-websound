import { useState, useEffect, useRef } from "react";
import ItemAudio from "./ItemAudio";
import logoUrl from "../assets/react.svg";

export default function AudioContainer({ audioList }) {
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setCurrentAudio(audioList[0]);
  }, [audioList]);

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel='icon']");

    if (currentAudio) {
      audioRef.current.src = currentAudio.url;
      document.title = currentAudio.title;
      faviconLink.href = currentAudio.cover;
    }
  }, [currentAudio]);
  return (
    <>
      <ul className="divide-y divide-slate-300 bg-slate-300 fixed top-14 bottom-14 overflow-y-auto">
        {Array.isArray(audioList) &&
          audioList.map(
            (audio) =>
              typeof audio === "object" &&
              audio.title && (
                <ItemAudio
                  key={audio.title}
                  audio={audio}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              )
          )}
      </ul>
      <div className="fixed bottom-1 left-1 right-1">
        <p className="justify-center flex text-center text-violet-500 text-3xl">{currentAudio?.title}</p>
        <audio className="w-full" ref={audioRef} controls />
      </div>
    </>
  );
}
