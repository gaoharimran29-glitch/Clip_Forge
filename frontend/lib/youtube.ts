/**
 * Extracts an 11-character YouTube video ID from a variety of URL formats
 * (watch?v=, youtu.be/, embed/, etc). Returns null if no valid ID is found.
 */
export function getYouTubeId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\/\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
