import { Artist } from "./type";

const clientId = "602be77013674f7b92c888d547dc627a"; // Replace with your client id
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
    "user-read-private user-read-email user-library-read user-top-read user-follow-read"
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

async function getUserAccessToken(code: string): Promise<string> {
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

  const { access_token } = await result.json();
  return access_token;
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
  const artists = items.map((i: { id: string; name: string }) => {
    return {
      id: i.id,
      name: i.name,
    } as Artist;
  });
  return artists;
};
export {
  redirectToAuthCodeFlow,
  clientId,
  getUserAccessToken,
  fetchProfile,
  getSavedAlbums,
  getTopItems,
  getFollowedArtists,
};
