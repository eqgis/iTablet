
export interface AssetItem extends ImageItem {
  type: string;
  group_name: string;
  timestamp: number;
  location: LocationItem | null;
}

export interface ImageItem {
  filename: string | null;
  uri: string;
  height: number;
  width: number;
  fileSize: number | null;
  playableDuration: number | null;
}

export interface LocationItem {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface SelectedItems {
  [groupName: string]: AssetItem[],
}