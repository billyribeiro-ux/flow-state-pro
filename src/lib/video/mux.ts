import Mux from "@mux/mux-node";

const mux = process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET
  ? new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    })
  : null;

export interface MuxAsset {
  id: string;
  playbackId: string;
  status: string;
  duration: number;
}

export async function getMuxAsset(assetId: string): Promise<MuxAsset | null> {
  if (!mux) {
    console.warn("Mux not configured");
    return null;
  }

  try {
    const asset = await mux.video.assets.retrieve(assetId);
    const playbackId = asset.playback_ids?.[0]?.id ?? "";

    return {
      id: asset.id,
      playbackId,
      status: asset.status,
      duration: asset.duration ?? 0,
    };
  } catch (error) {
    console.error("Failed to get Mux asset:", error);
    return null;
  }
}

export function getMuxStreamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function getMuxThumbnailUrl(
  playbackId: string,
  options?: { width?: number; height?: number; time?: number }
): string {
  const params = new URLSearchParams();
  if (options?.width) params.set("width", String(options.width));
  if (options?.height) params.set("height", String(options.height));
  if (options?.time) params.set("time", String(options.time));

  const query = params.toString();
  return `https://image.mux.com/${playbackId}/thumbnail.webp${query ? `?${query}` : ""}`;
}

export function getMuxGifUrl(playbackId: string): string {
  return `https://image.mux.com/${playbackId}/animated.gif?width=320`;
}
