import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import NavItem from "./components/NavItem";
import Audio from "./components/Audio";
import List from "./components/List";
import ListItem from "./components/ListItem";
import logoUrl from "./assets/react.svg";

function getAlbum(album = null) {
  let result = [];
  let apiLink;
  if (album === null) {
    apiLink = "https://serverdash.serv00.net/list";
  } else {
    apiLink = `https://serverdash.serv00.net/list?album=${album}`;
  }

  fetch(apiLink)
    .then((response) => response.json())
    .then((data) =>
      data.forEach((item) => {
        fetch(`https://serverdash.serv00.net/get?title=${item}`)
          .then((response) => response.json())
          .then((data) => {
            result.push(data);
          });
      })
    );
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
    const audios = getAlbum();
    setAudioList(audios);
    setCurrentAudio(audios[0]);
  }, []);

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
        <Audio />
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
            <ListItem
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
