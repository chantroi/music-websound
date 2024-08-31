import { useState, useEffect, useRef } from "react";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import Navbar from "./Navbar";
import Albums from "./Albums";
import { getAlbum } from "./util";

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [audioList, setAudioList] = useState([]);
  const [isExtendList, setExtendList] = useState(false);
  const audioPlayer = useRef(null);
  const audioSrc = useRef(null);
  const motionCont = useRef(null);

  useEffect(() => {
    (async () => {
      const res = await getAlbum();
      setAudioList(res);
    })();
  }, []);

  useEffect(() => {
    async () => {
      while (true) {
        if (audioPlayer.current && motionCont.current) {
          new AudioMotionAnalyzer(motionCont.current, {
            source: audioPlayer.current,
          });
          console.log("done");
          break;
        }
      }
    };
  }, []);

  return (
    <>
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        {currentTab === "albums" && <Albums setCurrentTab={setCurrentTab} />}
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">Music Player</h1>
          <div ref={motionCont} className="w-full h-1/3"></div>
          <div className="mt-4">
            <audio controls ref={audioPlayer}>
              <source
                ref={audioSrc}
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                type="audio/mpeg"
              />
            </audio>
          </div>
          <div className="mt-4">
            <button
              className={
                "w-full p-2 text-lg font-bold text-white bg-gray-500 rounded-lg hover:bg-gray-700" +
                (isExtendList ? " bg-gray-700" : "")
              }
              onClick={() => setExtendList(!isExtendList)}
            >
              Danh Sách Phát
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
