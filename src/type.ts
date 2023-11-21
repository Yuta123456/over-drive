export type Playlist = {
  id: string;
  name: string;
  artists: Artist[];
  tracks: Track[];
};
export type Artist = {
  id: string;
  name: string;
  imageURL: string;
};

export type Track = {
  name: string;
  artistName: string;
};
