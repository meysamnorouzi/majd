/** WordPress fetch — never throws on network/TLS errors; returns null instead. */
export async function wpFetch(
  url: string,
  init?: RequestInit,
): Promise<Response | null> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[wpFetch failed]", url, error);
    }
    return null;
  }
}
