"use client";
import {
  getFollowedArtists,
  getUserAccessToken,
  redirectToAuthCodeFlow,
} from "@/utils";
import { Box, Button } from "@chakra-ui/react";
export const LoginComponent = () => {
  return (
    <Box w="100%" display="flex" justifyContent="center">
      プレイリストに参加
      <Button
        onClick={() => {
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          const fetchResult = async () => {
            if (!code) {
              redirectToAuthCodeFlow();
            } else {
              const accessToken = await getUserAccessToken(code);
              const follow = await getFollowedArtists(accessToken);
              console.log(follow);
            }
          };
          fetchResult();
        }}
      >
        Spotifyにログイン
      </Button>
    </Box>
  );
};
