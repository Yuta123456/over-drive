export const getAccessToken = async () => {
  // curl -X POST "https://accounts.spotify.com/api/token" \
  //    -H "Content-Type: application/x-www-form-urlencoded" \
  //    -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
  const body = `grant_type=client_credentials&client_id=602be77013674f7b92c888d547dc627a&client_secret=f2221780b4634224a13ec9a26a646f18`;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: body,
  }).then((r) => r.json());
  console.log(res);
  return res.access_token;
};

const clientId = "602be77013674f7b92c888d547dc627a"; // Replace with your client id
const code = undefined;

async function redirectToAuthCodeFlow() {
  // TODO: Redirect to Spotify authorization page
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:3000/spotify");
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

async function getUserAccessToken(
  clientId: string,
  code: string
): Promise<string> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", `http://localhost:3000/spotify`);
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

const getFollowedArtists = async (token: string) => {
  const type = "artist";
  const artists = await fetch(
    `https://api.spotify.com/v1/me/following?type=${type}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  ).then((r) => r.json());
  return artists.items;
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
