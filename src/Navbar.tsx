import React from "react";

export default function Navbar({
  currentTab,
  setCurrentTab,
}: {
  currentTab: string;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <nav className="flex justify-center bg-gray-800">
      <button
        className={`px-4 py-2 text-white hover:bg-gray-700 ${
          currentTab === "albums" ? "bg-gray-700" : ""
        }`}
        onClick={() => {
          setCurrentTab("albums");
        }}
      >
        Albums
      </button>
      <button
        className={`px-4 py-2 text-white hover:bg-gray-700 ${
          currentTab === "search" ? "bg-gray-700" : ""
        }`}
        onClick={() => {
          setCurrentTab("search");
        }}
      >
        Search
      </button>
      <button
        className={`px-4 py-2 text-white hover:bg-gray-700 ${
          currentTab === "chat" ? "bg-gray-700" : ""
        }`}
        onClick={() => {
          setCurrentTab("chat");
        }}
      >
        Chat
      </button>
    </nav>
  );
}
