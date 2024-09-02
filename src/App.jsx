import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import NavItem from "./components/NavItem";
import Audio from "./components/Audio";
import List from "./components/List";
import ItemAudio from "./components/ItemAudio";
import logoUrl from "./assets/react.svg";

async function getAlbum(album = null) {
  let result = [];
  let apiLink =
    album === null
      ? "https://serverdash.serv00.net/list"
      : `https://serverdash.serv00.net/list?album=${album}`;

  const response = await fetch(apiLink);
  const data = await response.json();

  for (const item of data) {
    const audioResponse = await fetch(
      `https://serverdash.serv00.net/get?title=${item}`
    );
    const audioData = await audioResponse.json();
    result.push(audioData);
  }

  return result;
}

export default function App() {
  const navItems = ["Danh Sách", "Bộ Sưu Tập", "Tìm Kiếm"];
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [audioList, setAudioList] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel='icon']");

    if (faviconLink) {
      faviconLink.href = logoUrl;
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const audios = await getAlbum();
      setAudioList(audios);
    }
    if (audioList.length === 0) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (audioList.length !== 0) {
      setCurrentAudio(audioList[0]);
    }
  }, [audioList]);

  function togglePrevios() {
    if (currentAudio) {
      const index = audioList.indexOf(currentAudio);
      if (index > 0) {
        setCurrentAudio(audioList[index - 1]);
      }
    }
  }

  function toggleNext() {
    if (currentAudio) {
      const index = audioList.indexOf(currentAudio);
      if (index < audioList.length - 1) {
        setCurrentAudio(audioList[index + 1]);
      }
    }
  }

  return (
    <div className="h-screen bg-black">
      <Nav>
        {navItems.map((item) => (
          <NavItem
            key={item}
            isActive={item === activeNavItem}
            setActiveNavItem={setActiveNavItem}
          >
            {item}
          </NavItem>
        ))}
      </Nav>
      {!currentAudio ? (
        <div className="flex justify-center items-center h-full">
          <img src={logoUrl} alt="logo" />
        </div>
      ) : (
        <Audio
          title={currentAudio.title}
          audioSrc={currentAudio.url}
          artist={currentAudio.artist}
          coverArt={currentAudio.cover}
          lyricsUrl={currentAudio.lrc}
          togglePrevios={togglePrevios}
          toggleNext={toggleNext}
        />
      )}
      {activeNavItem === "Danh Sách" && (
        <List>
          {audioList.map((item) => (
            <ItemAudio
              key={item.title}
              audio={item}
              currentAudio={currentAudio}
              setCurrentAudio={setCurrentAudio}
            />
          ))}
        </List>
      )}
    </div>
  );
}
