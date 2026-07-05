export interface Clip {
  id: number;
  start: number;
  end: number;
  score: number;
  reason: string;
  caption: string;
  filename: string;
  download_url: string;
}
