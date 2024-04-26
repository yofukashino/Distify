import { contextMenu as ContextMenuUtils, React } from "replugged/common";
import { ContextMenu } from "replugged/components";
import { PluginLogger } from "../index";
import { BASE_URL, BASE_URL_PLAYER } from "./consts";
import Modules from "./requiredModules";
import MenuItems from "../Components/MenuItems";
import Types from "../types";
export const customCacheSpotifyMeta = new Map<string, string[]>();
export const ensureSpotifyPlayer = (): Promise<{
  socket?: Types.SpotifySocket;
  device?: Types.SpotifyDevice;
}> => {
  const { SpotifyStore } = Modules;
  const activePlayer = SpotifyStore.getActiveSocketAndDevice();
  if (activePlayer) return Promise.resolve(activePlayer);
  const playableDevices = SpotifyStore.getPlayableComputerDevices();
  if (playableDevices.length > 0) {
    const [{ socket, device }] = playableDevices;
    return Promise.resolve({
      socket,
      device,
    });
  }
  return new Promise((res) => {
    const timer = { timeout: null };
    const changeListerner = () => {
      const playableDevices = SpotifyStore.getPlayableComputerDevices();
      const [{ socket, device }] = playableDevices;
      clearTimeout(timer?.timeout);
      SpotifyStore.removeChangeListener(changeListerner);
      res({
        socket,
        device,
      });
    };
    SpotifyStore.addChangeListener(changeListerner);
    timer.timeout = setTimeout(() => {
      SpotifyStore.removeChangeListener(changeListerner);
      res({});
    }, 2500);
    open("spotify:");
  });
};
export const error = async (res): Promise<Error> => {
  switch (res.status) {
    case 401:
    case 403:
      return new Error("Unauthorized. Relinking Account or Updating Player May Help");
    case 404:
      return new Error("It's recommended To Open Spotify");
    case 429:
      throw new Error("Wait Before Clicking Again");
    default:
      if (res.status >= 500) return new Error("Spotify Internal Issues. Try Later");
      PluginLogger.error(`${res.status}: ${res.statusText} - ${await res.text()}`);
      return new Error("Unknown Error, Check the console and report the dev");
  }
};
export const play = async (type: string, id: string): Promise<void> => {
  const { socket, device } = await ensureSpotifyPlayer();
  if (!socket?.accessToken) {
    throw new Error("Please link your Spotify to Discord in Settings > Connections");
  }

  const SpotifyResponse = await fetch(`${BASE_URL_PLAYER}/play?device_id=${device.id}`, {
    method: "PUT",
    body: JSON.stringify(
      type === "track"
        ? { uris: [`spotify:${type}:${id}`] }
        : { context_uri: `spotify:${type}:${id}` },
    ),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${socket?.accessToken}`,
    },
  });
  if (SpotifyResponse.ok) {
    return;
  }
  throw await error(SpotifyResponse);
};

export const queue = async (type: string, id: string): Promise<void> => {
  const { socket, device } = await ensureSpotifyPlayer();
  if (!socket?.accessToken) {
    throw new Error("Please link your Spotify to Discord in Settings > Connections");
  }
  const SpotifyResponse = await fetch(
    `${BASE_URL_PLAYER}/queue?uri=${encodeURIComponent(`spotify:${type}:${id}`)}&device_id=${
      device.id
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${socket?.accessToken}`,
      },
    },
  );
  if (SpotifyResponse.ok) {
    return;
  }
  throw await error(SpotifyResponse);
};

export const mapMenuItems = <R extends React.ReactElement[] | string[][]>(
  SpotifyLinks: string[][],
  SpotifyAccounts: Types.SpotifyAccounts[],
  type:
    | { data: boolean; queue?: never; play?: never }
    | {
        data?: never;
        queue: boolean;
        play: boolean;
      },
): R => {
  const [SpotifyMeta, setSpotifyMeta] = React.useState(
    SpotifyLinks.map(([_, type, id]) => {
      if (customCacheSpotifyMeta.has(id)) {
        return customCacheSpotifyMeta.get(id);
      }
      return [_, type, id, ""];
    }),
  );
  React.useEffect(() => {
    const abortController = new AbortController();
    const getAndSetSpotifyMeta = async () => {
      const meta = await Promise.all(
        SpotifyLinks.map<Promise<string[]>>(async ([_, type, id]) => {
          try {
            if (customCacheSpotifyMeta.has(id)) {
              return customCacheSpotifyMeta.get(id);
            }
            const SpotifyResponse = await fetch(`${BASE_URL}/${type}s/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SpotifyAccounts[0].accessToken}`,
              },
              signal: abortController.signal,
            })
              .then((res) => res.json())
              .catch(() => ({ name: "Error Fetching Name" }));
            if (SpotifyResponse?.name)
              customCacheSpotifyMeta.set(id, [_, type, id, SpotifyResponse?.name]);
            return [_, type, id, SpotifyResponse?.name ?? "Error Fetching Name"];
          } catch {
            return [_, type, id, "Error Fetching Name"];
          }
        }),
      );
      setSpotifyMeta(meta);
    };
    if (SpotifyAccounts.length > 0) {
      getAndSetSpotifyMeta();
    }

    return () => {
      abortController.abort();
    };
  }, []);
  try {
    if (SpotifyAccounts.length <= 0) {
      return [MenuItems.noAccounts()] as R;
    }

    if ((type as { data: boolean }).data) {
      return SpotifyMeta as R;
    }
    return [
      type.play && MenuItems.play(SpotifyMeta),
      type.queue && MenuItems.queue(SpotifyMeta),
    ] as R;
  } catch {
    return [] as R;
  }
};

export const openContextMenu = (
  event: React.MouseEvent,
  SpotifyLinks: string[][],
  SpotifyAccounts: Types.SpotifyAccounts[],
  type: {
    queue: boolean;
    play: boolean;
  },
): void => {
  event.currentTarget = document.querySelector(`#distify-${type.play ? "play" : "queue"}`);
  const MyContextMenu = (props) => {
    const MappedItems = mapMenuItems<React.ReactElement[]>(SpotifyLinks, SpotifyAccounts, type);
    return (
      <ContextMenu.ContextMenu {...props} navId={"yofukashino-distify"}>
        {...MappedItems}
      </ContextMenu.ContextMenu>
    );
  };
  ContextMenuUtils.open(event, (e) => <MyContextMenu {...e} onClose={ContextMenuUtils.close} />);
};

export default { error, play, queue, mapMenuItems, openContextMenu };
