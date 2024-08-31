"use client";
import { useState, useRef } from "react";

const Home = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = [
    {
      title: "Bài hát 1",
      artist: "Nghệ sĩ 1",
      src: "/tracks/song1.mp3",
    },
    {
      title: "Bài hát 2",
      artist: "Nghệ sĩ 2",
      src: "/tracks/song2.mp3",
    },
    // Thêm nhiều bài hát hơn nếu cần
  ];

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % tracks.length);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentTrack((prevTrack) =>
      prevTrack === 0 ? tracks.length - 1 : prevTrack - 1
    );
    setIsPlaying(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Trình phát nhạc</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{tracks[currentTrack].title}</h2>
        <p className="text-sm text-gray-600">{tracks[currentTrack].artist}</p>
      </div>
      <audio
        ref={audioRef}
        src={tracks[currentTrack].src}
        onEnded={handleNext}
      />
      <div className="flex items-center justify-center space-x-4 mt-4">
        <button
          onClick={handlePrevious}
          className="p-2 bg-gray-300 rounded-full"
        >
          ⏮️
        </button>
        <button
          onClick={handlePlayPause}
          className="p-4 bg-blue-500 text-white rounded-full"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <button onClick={handleNext} className="p-2 bg-gray-300 rounded-full">
          ⏭️
        </button>
      </div>
    </div>
  );
};

export default Home;