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
      faviconLink.href = logoUrl;
    }
  }, [currentAudio]);
  return (
    <>
      <div className="fixed bottom-1 left-1 right-1">
        <ul className="divide-y divide-slate-300 bg-slate-300 fixed top-20 bottom-15 overflow-y-auto">
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
        <audio className="w-full" ref={audioRef} controls />
      </div>
    </>
  );
}
