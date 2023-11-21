"use client";
import { playlistAtom } from "@/app/atoms";
import { db } from "@/firebase";
import { Playlist } from "@/type";
import { getFollowedArtists, redirectToAuthCodeFlow } from "@/utils";
import { Box, Button } from "@chakra-ui/react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export const ManagementPlaylistComponent = () => {
  const accessToken =
    typeof window !== undefined ? sessionStorage.getItem("accessToken") : null;
  const playlistId =
    typeof window !== undefined ? sessionStorage.getItem("playlistId") : null;
  const [isAttend, setIsAttend] = useState(false);
  const attendPlaylist = async () => {
    if (!accessToken) {
      return <>accessTokenが無いです</>;
    }
    const followArtist = await getFollowedArtists(accessToken);
    const playlistsRef = collection(db, "playlists");

    const q = query(playlistsRef, where("id", "==", playlistId));
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
    const playlistRef = doc(db, "playlists", playlistDocumentId);
    console.log(followArtist);
    await updateDoc(playlistRef, {
      ...playlistData,
      // 重複する
      artists: [...playlistData.artists, ...followArtist],
    });
    setIsAttend(true);
  };
  return !isAttend ? (
    <Box w="100%" display="flex" justifyContent="center">
      <Button>プレイリストをDL</Button>
      <Button onClick={() => attendPlaylist()}>プレイリストに参加</Button>
    </Box>
  ) : (
    <>参加しました</>
  );
};
