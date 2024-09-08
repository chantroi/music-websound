import { useState, useEffect, useRef } from "react";
import ItemAudio from "./ItemAudio";
import List from "./List";

export default function AudioContainer({ audioList }) {
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setCurrentAudio(audioList[0]);
    audioRef.current.addEvenListener("ended", () => {
      if (audioList.indexOf(currentAudio) === audioList.length) {
        setCurrentAudio(audioList[0]);
      } else {
        setCurrentAudio(audioList[audioList.indexOf(currentAudio) + 1]);
      }
    });
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
      <List>
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
      </List>
      <div className="fixed bottom-1 left-1 right-1">
        <p className="justify-center flex text-center text-violet-500 text-3xl">
          {currentAudio?.title}
        </p>
        <audio className="w-full" ref={audioRef} controls />
      </div>
    </>
  );
}
