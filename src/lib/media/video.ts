export type VideoProvider = "youtube" | "aparat" | "vimeo" | "file";

export type ParsedVideo = {
  provider: VideoProvider;
  embedUrl: string;
  poster?: string;
};

export function parseVideoSource(src: string): ParsedVideo | null {
  const trimmed = src.trim();
  if (!trimmed) return null;

  const youtube = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
  );
  if (youtube?.[1]) {
    const id = youtube[1];
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const aparat = trimmed.match(
    /aparat\.com\/(?:v\/|video\/video\/embed\/videohash\/)([A-Za-z0-9]+)/i,
  );
  if (aparat?.[1]) {
    const id = aparat[1];
    return {
      provider: "aparat",
      embedUrl: `https://www.aparat.com/video/video/embed/videohash/${id}/vt/frame`,
    };
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo?.[1]) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  }

  return {
    provider: "file",
    embedUrl: trimmed,
  };
}
