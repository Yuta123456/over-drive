"use client";
import {
  getFollowedArtists,
  getUserAccessToken,
  redirectToAuthCodeFlow,
} from "@/utils";
import { Box, Button, Text } from "@chakra-ui/react";
export const LoginComponent = () => {
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
      <Text>プレイリストに参加するためにはログインが必要です。</Text>
      <Button
        onClick={() => {
          redirectToAuthCodeFlow();
        }}
        colorScheme="green"
        marginTop={30}
        color="black"
      >
        Spotifyにログイン
      </Button>
    </Box>
  );
};
