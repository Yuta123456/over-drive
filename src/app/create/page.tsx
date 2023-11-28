"use client";
import { db } from "@/firebase";
import { Playlist } from "@/type";
import { Box, Button } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
export default function Home() {
  const [playlistName, setPlaylistName] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [shareURL, setShareURL] = useState("");
  const onCreate = async (playlistName: string) => {
    const playlistRef = collection(db, "playlists");
    const playlistId = uuidv4();
    const playlist: Playlist = {
      id: playlistId,
      name: playlistName,
      artists: [],
      tracks: [],
      countArtists: [],
    };
    await setDoc(doc(playlistRef), playlist);
    if (typeof window !== undefined) {
      sessionStorage.setItem("playlistId", playlistId);
    }
    setShareURL(window.location.origin + "/view/" + playlistId);
  };
  return !isCreated ? (
    <Box
      w="80%"
      display="flex"
      margin="auto"
      justifyContent="center"
      flexDirection="column"
    >
      <Input
        placeholder="プレイリスト名を入力"
        value={playlistName}
        onChange={(e) => {
          setPlaylistName(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          onCreate(playlistName);
          setIsCreated(true);
          setPlaylistName("");
        }}
      >
        プレイリストを作成
      </Button>
    </Box>
  ) : (
    <>
      <div>プレイリストを作成しました: {shareURL}</div>
    </>
  );
}
