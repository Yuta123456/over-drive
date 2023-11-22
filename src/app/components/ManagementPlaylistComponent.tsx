"use client";
import { db } from "@/firebase";
import { Playlist } from "@/type";
import {
  createPlaylist,
  addTracks,
  getFollowedArtists,
  redirectToAuthCodeFlow,
  getAccessTokenFromLocalStorage,
  countDuplicateIds,
  removeDuplicateIds,
} from "@/utils";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Text,
  Image,
  StackDivider,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  const router = useRouter();
  const toast = useToast();
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

    setPlaylistData(playlistData);
  };
  useEffect(() => {
    if (!playlistFirebaseId) {
      return;
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistFirebaseId]);
  const attendPlaylist = async () => {
    if (!accessToken || !playlistData) {
      return;
    }
    const followArtist = await getFollowedArtists(accessToken);

    const playlistRef = doc(db, "playlists", playlistDocumentId);
    const newArtists = [...playlistData.artists, ...followArtist];
    const countArtists = countDuplicateIds(newArtists);
    const removeDuplicateArtists = removeDuplicateIds(newArtists);
    await updateDoc(playlistRef, {
      ...playlistData,
      artists: removeDuplicateArtists,
      countArtists: countArtists,
    });
    setIsAttend(true);
    toast({
      description: "参加しました",
      status: "success",
      duration: 2000,
    });
    init();
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
    toast({
      description: "ダウンロードしました",
      status: "success",
      duration: 2000,
    });
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
      {playlistData && (
        <>
          <Heading paddingBottom={10} as="h3" fontSize={30}>
            プレイリスト
          </Heading>
          <Heading as="h4" fontSize={30}>
            {playlistData.name}
          </Heading>
          <VStack spacing={4} align="stretch" marginY={10}>
            {playlistData.artists.length === 0 ? (
              <Text>プレイリストに参加しましょう</Text>
            ) : (
              <>
                {playlistData.artists.slice(0, 4).map((artist) => {
                  return (
                    <Card
                      direction={{ base: "column", sm: "row" }}
                      // overflow="hidden"
                      variant="outline"
                      key={artist.id}
                      width={"100%"}
                      boxShadow="lg"
                      rounded="lg"
                      p={2}
                    >
                      <Image
                        objectFit="fill"
                        maxW={{ base: "100%", sm: "100px" }}
                        src={artist.imageURL}
                        alt={artist.name}
                      />
                      <CardBody alignItems={"center"} display="flex">
                        <Heading size="md">{artist.name}</Heading>
                      </CardBody>
                    </Card>
                  );
                })}
                {playlistData.artists.length - 4 > 0 && (
                  <Text>
                    その他{playlistData.artists.length - 4}人のアーティスト
                  </Text>
                )}
              </>
            )}
          </VStack>
        </>
      )}
      <Stack flexDirection={"row"}>
        <Button
          onClick={() => {
            downloadPlaylist().catch((e) => console.log(e));
          }}
          colorScheme="green"
          color="black"
        >
          プレイリストを取得
        </Button>
        {!isAttend && (
          <Button
            colorScheme="green"
            color="black"
            onClick={() => attendPlaylist()}
          >
            プレイリストに参加
          </Button>
        )}
      </Stack>
    </Box>
  );
};
