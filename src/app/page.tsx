"use client";
import { db } from "@/firebase";
import { Playlist } from "@/type";
import { copyToClipboard, redirectToAuthCodeFlow } from "@/utils";
import { Box, Button, IconButton, Input, Text } from "@chakra-ui/react";
import { collection, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaCopy } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
export default function Home() {
  const [playlistName, setPlaylistName] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [shareURL, setShareURL] = useState("");
  const toast = useToast();
  const router = useRouter();

  const onCreate = async (playlistName: string) => {
    const playlistRef = collection(db, "playlists");
    const playlistId = uuidv4();
    const playlist: Playlist = {
      id: playlistId,
      name: playlistName,
      artists: [],
      tracks: [],
    };
    await setDoc(doc(playlistRef), playlist);
    if (typeof window !== undefined) {
      sessionStorage.setItem("playlistId", playlistId);
    }
    setShareURL(window.location.origin + "/view/" + playlistId);
  };
  return (
    <Box
      w="80%"
      display="flex"
      margin="auto"
      justifyContent="center"
      alignItems={"center"}
      flexDirection="column"
      paddingY={50}
    >
      {!isCreated ? (
        <>
          <Text textAlign={"center"}>
            Spotifyにログインするだけでドライブ用のプレイリストを作成しましょう。
          </Text>
          <Input
            marginTop={30}
            width={"50%"}
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
            colorScheme="green"
            marginTop={30}
            color="black"
          >
            プレイリストを作成
          </Button>
        </>
      ) : (
        <>
          <Text>プレイリストを作成しました</Text>
          <Text>友達にURLを共有してみましょう!</Text>
          <Text>
            {shareURL}{" "}
            <IconButton
              icon={<FaCopy />}
              onClick={() => {
                copyToClipboard(shareURL);
                toast({
                  description: "URLをコピーしました",
                  status: "success",
                  duration: 2000,
                });
              }}
              aria-label={"copy share url"}
            />
          </Text>
        </>
      )}
    </Box>
  );
}
