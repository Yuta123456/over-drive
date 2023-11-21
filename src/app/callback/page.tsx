"use client";

import { useRouter } from "next/navigation";
import { getUserAccessToken } from "@/utils";

export default function Home() {
  const router = useRouter();
  if (typeof window === "undefined") {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const playlistId =
    typeof window !== undefined ? sessionStorage.getItem("playlistId") : null;
  const setAccessToken = async () => {
    if (code) {
      const accessToken = await getUserAccessToken(code);
      console.log(accessToken, playlistId);
      if (playlistId) {
        router.push("/view/" + playlistId);
      }
    }
  };
  setAccessToken();

  return null;
}
