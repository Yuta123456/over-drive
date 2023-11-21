"use client";
import { playlistAtom } from "@/app/atoms";
import { LoginComponent } from "@/app/components/LoginComponent";
import { ManagementPlaylistComponent } from "@/app/components/ManagementPlaylistComponent";
import { db } from "@/firebase";
import { Playlist } from "@/type";
import {
  getFollowedArtists,
  getUserAccessToken,
  redirectToAuthCodeFlow,
} from "@/utils";
import { Box, Button } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
export default function Home({ params }: { params: { playlistId: string } }) {
  // 全く時間考えてないのでダメ
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLogin(sessionStorage.getItem("accessToken") ? true : false);
      sessionStorage.setItem("playlistId", params.playlistId);
    }
  }, [params.playlistId]);
  return !isLogin ? <LoginComponent /> : <ManagementPlaylistComponent />;
}