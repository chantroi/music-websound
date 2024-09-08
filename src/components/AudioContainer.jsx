import { useState, useEffect, useRef } from "react";
import ItemAudio from "./ItemAudio";
import List from "./List";

export default function AudioContainer({ audioList }) {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isAddEvent, setIsAddEvent] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setCurrentAudio(audioList[0]);
  }, [audioList]);

  useEffect(() => {
    if (isAddEvent) return;
    setIsAddEvent(true);
    audioRef.current.addEventListener("ended", () => {
      const currentIndex = audioList.indexOf(currentAudio);
      const nextIndex = (currentIndex + 1) % audioList.length;
      setCurrentAudio(audioList[nextIndex]);
      audioRef.current.play();
    });
  }, [audioRef.current, currentAudio, audioList]);

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel='icon']");

    if (currentAudio) {
      audioRef.current.src = currentAudio.url;
      document.title = currentAudio.title + " | Websound";
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
        <p className="justify-center flex text-center text-amber-600 text-3xl pointer-events-none">
          {currentAudio?.title} | {currentAudio?.artist}
        </p>
        <audio className="w-full" ref={audioRef} controls />
      </div>
    </>
  );
}
