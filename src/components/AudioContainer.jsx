import { useState, useEffect, useRef } from "react";
import ItemAudio from "./ItemAudio";
import List from "./List";

export default function AudioContainer({ audioList }) {
  const [currentAudio, setCurrentAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setCurrentAudio(audioList[0]);
  }, [audioList]);

  useEffect(() => {
    const handleEnded = () => {
      const currentIndex = audioList.indexOf(currentAudio);
      const nextIndex = (currentIndex + 1) % audioList.length;
      setCurrentAudio(audioList[nextIndex]);
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded);
      }
    };
  }, [audioRef, currentAudio, audioList]);

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel='icon']");

    if (currentAudio) {
      audioRef.current.src = currentAudio.url;
      document.title = currentAudio.title + " | Websound";
      faviconLink.href = currentAudio.cover;
      audioRef.current.play();
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
        <p className="justify-center flex text-center text-slate-500 pointer-events-none">
          {currentAudio?.title} | {currentAudio?.artist}
        </p>
        <audio className="w-full" ref={audioRef} controls />
      </div>
    </>
  );
}
