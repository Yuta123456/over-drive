"use client";
import { LoginComponent } from "@/app/components/LoginComponent";
import { ManagementPlaylistComponent } from "@/app/components/ManagementPlaylistComponent";
import { getAccessTokenFromLocalStorage } from "@/utils";
import { useEffect, useMemo, useState } from "react";
export default function Home({ params }: { params: { playlistId: string } }) {
  const [isLogin, setIsLogin] = useState(false);
  if (typeof window !== "undefined") {
    sessionStorage.setItem("playlistId", params.playlistId);
  }
  getAccessTokenFromLocalStorage().then((v) => {
    if (v) {
      setIsLogin(true);
    }
  });
  return !isLogin ? <LoginComponent /> : <ManagementPlaylistComponent />;
}
