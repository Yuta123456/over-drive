import { collection, getDocs, query, where } from "firebase/firestore";
import { Artist, Playlist } from "./type";
import { db } from "./firebase";

const clientId = "602be77013674f7b92c888d547dc627a";
const code = undefined;

async function redirectToAuthCodeFlow(playlistId?: string) {
  // TODO: Redirect to Spotify authorization page
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  sessionStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:3000/callback");
  params.append(
    "scope",
    "user-read-private user-read-email playlist-modify-public user-library-read user-top-read user-follow-read"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
function generateCodeVerifier(length: number) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getUserAccessToken(code: string): Promise<string | null> {
  if (!code) {
    return null;
  }
  const verifier = sessionStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", `http://localhost:3000/callback`);
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const newAccessInfo = await result.json();
  console.log(newAccessInfo);
  if (typeof window !== "undefined" && newAccessInfo.access_token) {
    const currentTimeSeconds: number = Math.floor(new Date().getTime() / 1000);

    newAccessInfo.createAt = currentTimeSeconds;
    sessionStorage.setItem("accessInfo", JSON.stringify(newAccessInfo));
  }
  return newAccessInfo.access_token;
  // TODO: Get access token for code
}

async function fetchProfile(token: string): Promise<any> {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

function populateUI(profile: any) {
  // TODO: Update UI with profile data
}

const getSavedAlbums = async (token: string) => {
  const albums = await fetch("https://api.spotify.com/v1/me/albums", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const albumsResult = await albums.json();
  return albumsResult.items;
};

const getTopItems = async (token: string) => {
  const type = "artists";
  const artists = await fetch(`https://api.spotify.com/v1/me/top/${type}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
  return artists.items;
};

const getFollowedArtists = async (token: string): Promise<Artist[]> => {
  const type = "artist";
  const res = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  )
    .then((r) => r.json())
    .then((r) => r.artists)
    .catch((e) => console.log(e));
  const items = res.items;
  const artists = items.map(
    (i: {
      id: string;
      name: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
    }) => {
      return {
        id: i.id,
        name: i.name,
        imageURL: i.images[0].url,
      } as Artist;
    }
  );
  return artists;
};
const createPlaylist = async (token: string, playlistName: string) => {
  const profile = await fetchProfile(token);
  const userId = profile.id;
  console.log(playlistName);
  const res = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: playlistName,
      }),
    }
  )
    .then((r) => r.json())
    .catch((e) => console.log(e));
  const playlistId: string = res.id;
  console.log(res, playlistId);
  return playlistId;
};

const addTracks = async (
  playlistFirebaseId: string,
  playlistSpotifyId: string,
  token: string
) => {
  const playlistsRef = collection(db, "playlists");
  const q = query(playlistsRef, where("id", "==", playlistFirebaseId));
  const playlistInfo = await getDocs(q).then((snapshot) => {
    if (snapshot.size !== 1) {
      return;
    }

    const playlistData: Playlist = snapshot.docs[0].data() as Playlist;
    const playlistDocumentId: string = snapshot.docs[0].id;
    return { playlistData, playlistDocumentId };
  });
  if (!playlistInfo) {
    return;
  }
  const { playlistData, playlistDocumentId } = playlistInfo;
  const tracks = await Promise.all(
    playlistData.artists.map(async (artist) => {
      return fetch(
        `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=JP`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then(async (r) => {
        const res = await r.json();
        return res.tracks as any[];
      });
    })
  );
  const trackUris: string[] = tracks
    .flat()
    .slice(0, 100)
    .map((t) => t.uri);

  await fetch(
    `https://api.spotify.com/v1/playlists/${playlistSpotifyId}/tracks`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        uris: trackUris,
      }),
    }
  );
};

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
}

const getAccessTokenFromLocalStorage = async (
  signal: AbortSignal
): Promise<null | string> => {
  if (typeof window === "undefined") {
    return null;
  }
  const accessInfoString = sessionStorage.getItem("accessInfo");
  if (!accessInfoString) {
    return null;
  }

  const accessInfo = JSON.parse(accessInfoString);
  const createAt: number = accessInfo.createAt;
  const expiresIn: number = accessInfo.expires_in;
  const currentTimeSeconds: number = Math.floor(new Date().getTime() / 1000);
  if (createAt + expiresIn > currentTimeSeconds) {
    return accessInfo.access_token;
  }
  // 有効期限がすぎている場合
  const params = new URLSearchParams();
  // params.append("client_id", clientId);
  params.append("refresh_token", accessInfo.refresh_token);
  params.append("grant_type", "authorization_code");
  const newAccessInfo = await fetch("https://accounts.spotify.com/api/token", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    body: params,
    signal,
  }).then((r) => r.json());
  newAccessInfo.createAt = currentTimeSeconds;
  sessionStorage.setItem("accessInfo", JSON.stringify(accessInfo));
  return newAccessInfo.access_token;
};
function countDuplicateIds(artists: Artist[]): (Artist & { count: number })[] {
  const idCountMap: { [id: string]: number } = {};

  // IDの数を数える
  for (const artist of artists) {
    const id = artist.id;
    idCountMap[id] = (idCountMap[id] || 0) + 1;
  }

  // 結果を配列に変換
  const result: (Artist & { count: number })[] = [];
  for (const id in idCountMap) {
    if (idCountMap.hasOwnProperty(id)) {
      const artist = artists.filter((a) => a.id === id)[0];
      result.push({ ...artist, count: idCountMap[id] });
    }
  }

  return result;
}
function removeDuplicateIds(artists: Artist[]): Artist[] {
  const uniqueIds: Set<string> = new Set();
  const result: Artist[] = [];

  for (const artist of artists) {
    if (!uniqueIds.has(artist.id)) {
      // IDがまだ出現していない場合、結果に追加しセットに登録
      result.push(artist);
      uniqueIds.add(artist.id);
    }
  }

  return result;
}
export {
  addTracks,
  removeDuplicateIds,
  getAccessTokenFromLocalStorage,
  copyToClipboard,
  createPlaylist,
  redirectToAuthCodeFlow,
  clientId,
  getUserAccessToken,
  fetchProfile,
  getSavedAlbums,
  getTopItems,
  getFollowedArtists,
  countDuplicateIds,
};
