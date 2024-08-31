async function getAlbum(album: string | undefined = undefined) {
  if (album) {
    const req = await fetch(`https://api.com/get/album?album=${album}`);
    const res = await req.json();
    return res;
  } else {
    const req = await fetch(`https://api.com/get/album`);
    const res = await req.json();

    return res;
  }
}

export { getAlbum }