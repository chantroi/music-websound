import React, { useState, useEffect, useRef } from "react";
import Nav from "./components/Nav";
import NavItem from "./components/NavItem";
import List from "./components/List";
import SearchItem from "./components/SearchItem";
import ItemAlbum from "./components/ItemAlbum";
import AudioContainer from "./components/AudioContainer";
import logoUrl from "./assets/react.svg";

export default function App() {
  const navItems = ["Bộ Sưu Tập", "Tìm Kiếm"];
  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState("default");
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [audioList, setAudioList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchOption, setSearchOption] = useState("youtube");
  const inputRef = useRef(null);

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel='icon']");

    if (faviconLink) {
      faviconLink.href = logoUrl;
    }
  }, []);

  useEffect(() => {
    async function fetchAlbums() {
      const response = await fetch("https://serverdash.serv00.net/albums");
      const data = await response.json();
      setAlbums(data);
    }
    fetchAlbums();
  }, []);

  useEffect(() => {
    async function Exe() {
      let apiLink =
        currentAlbum === "default" || currentAlbum === ""
          ? "https://serverdash.serv00.net/list"
          : `https://serverdash.serv00.net/list?album=${currentAlbum}`;
      const response = await fetch(apiLink);
      const data = await response.json();
      for (const item of data) {
        const audioResponse = await fetch(
          `https://serverdash.serv00.net/get?title=${item}`
        );
        const audioData = await audioResponse.json();
        if (!audioList.includes(audioData)) {
          setAudioList((audioList) => [...audioList, audioData]);
        }
      }
    }
    Exe();
  }, [currentAlbum]);

  function onSearchOptionChange(e) {
    setSearchOption(e.target.value);
  }

  async function onSearch() {
    setActiveNavItem("");
    const query = inputRef.current.value;
    let req;
    if (searchOption === "youtube") {
      req = await fetch("https://serverdash.serv00.net/search/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });
    } else {
      req = await fetch("https://zingsearch-1-t0130600.deta.app/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });
    }
    
    const results = await req.json();
    setSearchResults(results);
    setActiveNavItem("Tìm Kiếm");
    inputRef.current.value = query;
  }

  return (
    <div className="h-screen bg-black w-screen">
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
      {audioList.length > 0 ? (
        <AudioContainer audioList={audioList} />
      ) : (
        <div className="flex items-center justify-center h-screen w-screen text-white">
          <img src={logoUrl} alt="logo" />
          Loading...
        </div>
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
              className="w-auto top-0"
              type="text"
              placeholder="Tìm kiếm ..."
              ref={inputRef}
            />
            <select value={searchOption} onChange={onSearchOptionChange}>
              <option value="youtube">Youtube</option>
              <option value="zingmp3">Zing Mp3</option>
            </select>
            <button onClick={onSearch} className="bg-sky-500">
              Tìm kiếm
            </button>
          </div>

          {searchResults.map((item) => (
            <SearchItem
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
