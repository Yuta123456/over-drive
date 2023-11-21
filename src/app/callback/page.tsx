"use client";

import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { playlistAtom } from "../atoms";
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
      if (accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
      }
      if (playlistId) {
        router.push("/view/" + playlistId);
      }
      console.log(accessToken, playlistId);
    }
  };
  setAccessToken();

  return null;
}
