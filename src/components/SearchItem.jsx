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
    setIsSaving(true);
    try {
      const req = await fetch(
        `https://serverdash.serv00.net/save/zing?url=${audio.url}&album=${album}`
      );
      const data = await req.json();
      if (data.success) {
        setAudioList((prevList) => {
          if (!prevList.some((item) => item.id === audio.id)) {
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
    <article
      className={`flex items-start space-x-6 p-6 cursor-pointer ${
        isSelected ? "bg-sky-300" : ""
      } ${isSaving ? "opacity-50" : ""}`}
      onClick={() => {
        if (!isSaving) {
          saveAudio(currentAlbum, audio);
        }
      }}
    >
      <img
        src={audio.cover}
        alt=""
        width="60"
        height="88"
        className="flex-none rounded-md bg-slate-100"
      />
      <div className="min-w-0 relative flex-auto">
        <h2 className="font-semibold text-slate-900 truncate pr-20">
          {audio.title}
        </h2>
        <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
          <div className="flex-none w-full mt-2 font-normal">
            <dt className="sr-only">Artist</dt>
            <dd className="text-slate-400">{audio.artist}</dd>
          </div>
        </dl>
        {isSaving && (
          <div className="absolute top-0 right-0 mt-1 mr-1">
            <span className="text-sm text-blue-500">Saving...</span>
          </div>
        )}
      </div>
    </article>
  );
}
