export type Playlist = {
  id: string;
  name: string;
  artists: Artist[];
  tracks: Track[];
};
export type Artist = {
  name: string;
};

export type Track = {
  name: string;
  artistName: string;
};
