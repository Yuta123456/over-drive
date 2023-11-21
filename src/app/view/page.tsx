"use client";
import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  return isLogin ? <LoginComponent /> : <ManagementPlaylistComponent />;
}

const LoginComponent = () => {
  return (
    <Box w="100%" display="flex" justifyContent="center">
      プレイリストに参加
      <Button>Spotifyにログイン</Button>
    </Box>
  );
};

const ManagementPlaylistComponent = () => {
  return (
    <Box w="100%" display="flex" justifyContent="center">
      <Button>プレイリストをDL</Button>
      <Button>プレイリストに参加</Button>
    </Box>
  );
};
