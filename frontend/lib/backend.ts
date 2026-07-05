const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

/** Builds a full backend URL from a relative path (e.g. a clip's download_url). */
export function backendUrl(path: string): string {
  return `${BACKEND_URL}${path}`;
}

export { BACKEND_URL };
