import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import NavItem from "./components/NavItem";
import Audio from "./components/Audio";
import List from "./components/List";
import ListItem from "./components/ListItem";

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
    setAudioList(getAlbum());
  }, []);

  return (
    <div className="h-screen">
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
      <Audio
        title={currentAudio?.title}
        audioSrc={currentAudio?.url}
        artist={currentAudio?.artist}
        coverArt={currentAudio?.cover}
        lyricsUrl={currentAudio?.lrc}
      />{" "}
      {activeNavItem === "Danh Sách" && (
        <List>
          {audioList.map((item) => (
            <ListItem
              key={item.title}
              audio={item}
              setCurrentAudio={setCurrentAudio}
            />
          ))}
        </List>
      )}
    </div>
  );
}
