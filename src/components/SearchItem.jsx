import { useState } from "react";

export default function SearchItem({
  audio,
  currentAlbum,
  audioList,
  setAudioList,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  async function saveAudio(album, audio) {
    setIsSelected(true);
    setIsSaving(true);

    try {
      const req = await fetch(
        `https://serverdash.serv00.net/save/zing?url=${audio.url}&album=${album}`
      );
      const data = await req.json();
      if (data.success) {
        setAudioList((prevList) => {
          // Kiểm tra xem audio đã tồn tại trong list chưa
          if (!prevList.some((item) => item.url === audio.url)) {
            return [...prevList, audio];
          }
          return prevList;
        });
        setIsSelected(true);
      } else {
        console.error("Failed to save audio:", data.message);
        setIsSelected(false);
      }
    } catch (error) {
      console.error("Error saving audio:", error);
      setIsSelected(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="w-screen">
      <div
        className={`w-full p-4 flex flex-row items-center justify-between ${
          isSelected ? "bg-red-500" : "bg-slate-300"
        }`}
        onClick={() => saveAudio(currentAlbum, audio)}
      >
        <img src={audio.cover} alt="" width="60" height="88" />
        <div className="min-w-0 relative flex-auto">
          <h2 className="font-semibold text-slate-900 truncate pr-20">
            {audio.title}
          </h2>
          {isSaving ? (
            <b className="text-sky-900 size-24 top-0">Saving...</b>
          ) : null}
          <p className="mt-1 text-slate-500 flex flex-row items-center justify-between">
            <span>{audio.artist}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
