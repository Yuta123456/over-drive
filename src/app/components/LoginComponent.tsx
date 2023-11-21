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
          redirectToAuthCodeFlow();
        }}
      >
        Spotifyにログイン
      </Button>
    </Box>
  );
};
