import React, { useState, useEffect, useRef } from "react";
import Nav from "./components/Nav";
import NavItem from "./components/NavItem";
import Audio from "./components/Audio";
import List from "./components/List";
import ItemAudio from "./components/ItemAudio";
import SearchItem from "./components/SearchItem";
import ItemAlbum from "./components/ItemAlbum";
import logoUrl from "./assets/react.svg";

async function getAlbumList() {
  const response = await fetch("https://serverdash.serv00.net/albums");
  const data = await response.json();
  return data;
}

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
  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState("default");
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [audioList, setAudioList] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const searchResults = useRef(null);
  const inputRef = useRef(null);

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
    if (audioList.length > 0) {
      setCurrentAudio(audioList[0]);
    }
  }, [audioList]);

  useEffect(() => {
    getAlbumList().then((data) => setAlbums(data));
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

  async function onSearch() {
    const query = inputRef.current.value;
    const req = await fetch("https://zingsearch-1-t0130600.deta.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
    });
    searchResults.current = await req.json();
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

      {activeNavItem === "Bộ Sưu Tập" && (
        <List>
          {albums.map((item) => (
            <ItemAlbum
              key={item.title}
              album={item}
              currentAlbum={currentAlbum}
              setCurrentAlbum={setCurrentAlbum}
            />
          ))}
        </List>
      )}
      {activeNavItem === "Tìm Kiếm" && (
        <List>
          <div className="flex left-1 right-1">
            <input
              className="w-full top-0"
              type="text"
              placeholder="Tìm kiếm ..."
              ref={inputRef}
            />
            <button onClick={() => onSearch()} className="bg-sky-500">
              Tìm kiếm
            </button>
          </div>

          {searchResults.current &&
            searchResults.current.map((item) => (
              <ItemAudio
                key={item.title}
                audio={item}
                currentAlbum={currentAlbum}
                audioList={audioList}
                setAudioList={setAudioList}
              />
            ))}
        </List>
      )}
    </div>
  );
}
