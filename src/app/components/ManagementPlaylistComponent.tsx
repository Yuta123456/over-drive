"use client";
import { playlistAtom } from "@/app/atoms";
import { db } from "@/firebase";
import { Playlist } from "@/type";
import {
  createPlaylist,
  addTracks,
  getFollowedArtists,
  redirectToAuthCodeFlow,
  getAccessTokenFromLocalStorage,
} from "@/utils";
import { Box, Button } from "@chakra-ui/react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

export const ManagementPlaylistComponent = () => {
  const [accessToken, setAccessToken] = useState<string>();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getAccessTokenFromLocalStorage(signal).then((r) => {
      if (r) {
        setAccessToken(r);
      }
    });
    return () => controller.abort();
  }, []);

  const playlistFirebaseId =
    typeof window !== undefined ? sessionStorage.getItem("playlistId") : null;
  const [isAttend, setIsAttend] = useState(false);
  const [playlistDocumentId, setPlaylistDocumentId] = useState("");
  const [playlistData, setPlaylistData] = useState<Playlist>();
  useEffect(() => {
    if (!playlistFirebaseId) {
      return;
    }
    const init = async () => {
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
      setPlaylistDocumentId(playlistDocumentId);
      console.log(playlistData);

      setPlaylistData(playlistData);
    };
    init();
  }, [playlistFirebaseId]);
  const attendPlaylist = async () => {
    if (!accessToken || !playlistData) {
      return;
    }
    console.log(accessToken, playlistData, playlistDocumentId);
    const followArtist = await getFollowedArtists(accessToken);

    console.log(followArtist);
    const playlistRef = doc(db, "playlists", playlistDocumentId);
    await updateDoc(playlistRef, {
      ...playlistData,
      // 重複する
      artists: [...playlistData.artists, ...followArtist],
    });
    setIsAttend(true);
  };

  const downloadPlaylist = async () => {
    if (!accessToken || !playlistFirebaseId || !playlistData) {
      return;
    }
    const spotifyPlaylistId = await createPlaylist(
      accessToken,
      playlistData.name
    );
    addTracks(playlistFirebaseId, spotifyPlaylistId, accessToken);
  };
  return !isAttend ? (
    <Box w="100%" display="flex" justifyContent="center">
      <Button
        onClick={() => {
          downloadPlaylist().catch((e) => console.log(e));
        }}
      >
        プレイリストをDL
      </Button>
      <Button onClick={() => attendPlaylist()}>プレイリストに参加</Button>
    </Box>
  ) : (
    <>参加しました</>
  );
};
