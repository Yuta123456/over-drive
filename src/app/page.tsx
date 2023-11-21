"use client";
import { db } from "@/firebase";
import { Playlist } from "@/type";
import { copyToClipboard, redirectToAuthCodeFlow } from "@/utils";
import { Box, Button, IconButton, Input, Text } from "@chakra-ui/react";
import { collection, setDoc, doc } from "firebase/firestore";
import drive from "../../public/drive.svg";
import music from "../../public/music.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaCopy } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import Image from "next/image";
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
          <Image src={drive} alt="over drive" width={300} />

          <Text>ドライブ用のプレイリストを作成できます</Text>
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
          <Image src={music} alt="listening music" width={300} />
          <Text marginTop={10} fontSize={20} textAlign={"center"}>
            プレイリストを作成しました！
            <br />
            友達にURLを共有してプレイリストを作成しましょう！
          </Text>
          <Box display={"flex"} marginTop={10}>
            <Input variant="outline" value={shareURL} marginRight={5} />{" "}
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
          </Box>
        </>
      )}
    </Box>
  );
}
