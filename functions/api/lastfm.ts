interface Env {
  LASTFM_API_KEY?: string;
  LASTFM_USERNAME?: string;
}

interface LastFmImage {
  size: string;
  "#text": string;
}

interface LastFmTrack {
  name?: string;
  url?: string;
  artist?: {
    "#text"?: string;
  };
  album?: {
    "#text"?: string;
  };
  image?: LastFmImage[];
  "@attr"?: {
    nowplaying?: string;
  };
}

interface LastFmResponse {
  recenttracks?: {
    track?: LastFmTrack | LastFmTrack[];
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.LASTFM_API_KEY || !env.LASTFM_USERNAME) {
    return json({ isPlaying: false }, 200);
  }

  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.searchParams.set("method", "user.getrecenttracks");
  url.searchParams.set("user", env.LASTFM_USERNAME);
  url.searchParams.set("api_key", env.LASTFM_API_KEY);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      cf: {
        cacheTtl: 20,
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      return json({ isPlaying: false }, 200);
    }

    const data = (await response.json()) as LastFmResponse;
    const tracks = data.recenttracks?.track;
    const track = Array.isArray(tracks) ? tracks[0] : tracks;

    if (!track || track["@attr"]?.nowplaying !== "true") {
      return json({ isPlaying: false }, 200);
    }

    const albumArt = track.image?.find((image) => image.size === "large")?.["#text"]
      || track.image?.find((image) => image["#text"])?.["#text"]
      || null;

    return json({
      isPlaying: true,
      title: track.name ?? "Unknown track",
      artist: track.artist?.["#text"] ?? "Unknown artist",
      album: track.album?.["#text"] ?? null,
      albumArt,
      url: track.url ?? null,
    }, 200);
  } catch {
    return json({ isPlaying: false }, 200);
  }
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=20, s-maxage=20",
    },
  });
}
