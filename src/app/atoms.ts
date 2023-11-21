import { atom } from "recoil";

export const playlistAtom = atom<string | null>({
  key: "playlistId",
  default: null,
});
