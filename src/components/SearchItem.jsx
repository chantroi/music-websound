export default function SearchItem({ audio, currentAlbum, setCurrentAudio }) {
  async function saveAudio(album, audio) {
    const req = await fetch("https://serverdash.serv00.net/save/zing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ album: album, url: audio.url }),
    });
    const data = await req.json();
    if (data) {
      setCurrentAudio(data);
    }
  }

  return (
    <article
      className="flex items-start space-x-6 p-6"
      onClick={() => saveAudio(currentAlbum, audio)}
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
            <dt className="sr-only">Cast</dt>
            <dd className="text-slate-400">{audio.artist}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
