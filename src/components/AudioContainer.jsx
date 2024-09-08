import { useState, useEffect, useRef } from "react";
import ItemAudio from "./ItemAudio";

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
    }
    if (faviconLink) {
      document.title = currentAudio.title;
      faviconLink.href = logoUrl;
    }
  }, [currentAudio]);
  return (
    <>
      <ul className="divide-y divide-slate-300 bg-slate-300 fixed top-8 bottom-20 left-1 right-1 overflow-y-auto">
        {Array.isArray(audioList) &&
          audioList.map(
            (audio) =>
              typeof audio === "object" && (
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
        <audio ref={audioRef} controls />
      </div>
    </>
  );
}
