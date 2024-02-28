import { contextMenu as ContextMenuUtils, React } from "replugged/common";
import { ContextMenu } from "replugged/components";
import { PluginLogger } from "../index";
import { BASE_URL, BASE_URL_PLAYER } from "./consts";
import { ConnectedAccountsStore } from "./requiredModules";
import MenuItems from "../Components/MenuItems";
import Types from "../types";
export const customCacheSpotifyMeta = new Map<string, string[]>();
export const error = async (res): Promise<Error> => {
  switch (res.status) {
    case 401:
    case 403:
      return new Error("Unauthorized. Relinking Account May Help");
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
export const play = async (type: string, id: string, accessToken: string): Promise<void> => {
  if (!accessToken) {
    PluginLogger.error("Please link your Spotify to Discord in Settings > Connections");
    return;
  }

  const SpotifyResponse = await fetch(`${BASE_URL_PLAYER}/play`, {
    method: "PUT",
    body: JSON.stringify(
      type === "track"
        ? { uris: [`spotify:${type}:${id}`] }
        : { context_uri: `spotify:${type}:${id}` },
    ),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (SpotifyResponse.ok) {
    return;
  }
  throw await error(SpotifyResponse);
};

export const queue = async (type: string, id: string, accessToken: string): Promise<void> => {
  if (!accessToken) {
    PluginLogger.error("Please link your Spotify to Discord in Settings > Connections");
    return;
  }

  const SpotifyResponse = await fetch(
    `${BASE_URL_PLAYER}/queue?uri=${encodeURIComponent(`spotify:${type}:${id}`)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (SpotifyResponse.ok) {
    return;
  }
  throw await error(SpotifyResponse);
};

export const mapMenuItems = (
  SpotifyLinks: string[][],
  SpotifyAccounts: Types.SpotifyAccounts[],
  type:
    | { data: boolean; queue?: never; play?: never }
    | {
        data?: never;
        queue: boolean;
        play: boolean;
      },
): React.ReactElement[] | string[][] => {
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
            console.log(SpotifyResponse);
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
      return [MenuItems.noAccounts()];
    }

    if ((type as { data: boolean }).data) {
      return SpotifyMeta;
    }
    if (SpotifyAccounts.length === 1) {
      return [
        type.play && MenuItems.play(SpotifyMeta, SpotifyAccounts[0]),
        type.queue && MenuItems.addToQueue(SpotifyMeta, SpotifyAccounts[0]),
      ];
    }
    return SpotifyAccounts.map((SpotifyAccount) => {
      return (
        <ContextMenu.MenuItem
          label={SpotifyAccount.name}
          id={`spotify-account-${SpotifyAccount.name}`}>
          {...[
            type.play && MenuItems.play(SpotifyMeta, SpotifyAccount),
            type.queue && MenuItems.addToQueue(SpotifyMeta, SpotifyAccount),
          ]}
        </ContextMenu.MenuItem>
      );
    });
  } catch {
    return [];
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
    const MappedItems = mapMenuItems(SpotifyLinks, SpotifyAccounts, type);
    return (
      <ContextMenu.ContextMenu {...props} navId={"tharki-distify"}>
        {...MappedItems as React.ReactElement[]}
      </ContextMenu.ContextMenu>
    );
  };
  ContextMenuUtils.open(event, (e) => <MyContextMenu {...e} onClose={ContextMenuUtils.close} />);
};

export const manipulateMenu = (
  message: Types.Message,
  menu: { children: React.ReactElement[] },
): React.ReactElement | void => {
  console.log(menu);
  const MenuGroup = menu?.children?.find?.((c) => c?.props?.id === "distify") ?? (
    <ContextMenu.MenuGroup />
  );
  MenuGroup.props.id = "distify";
  if (!menu?.children?.some?.((c) => c?.props?.id === "distify"))
    menu?.children.splice(1, 0, MenuGroup);
  const SpotifyLinks = Array.from(
    message.content.matchAll(/open.spotify.com\/(album|track|playlist)\/([^?]+)/g) as string[][] &
      IterableIterator<RegExpMatchArray>,
  );
  const SpotifyAccounts = ConnectedAccountsStore.getAccounts().filter((a) => a.type === "spotify");
  if (!SpotifyAccounts.length) {
    MenuGroup.props.children = [MenuItems.noAccounts()];
  }
  const SpotifyMeta = mapMenuItems(SpotifyLinks, SpotifyAccounts, {
    data: true,
  }) as string[][];
  if (SpotifyLinks.length <= 0) return;
  if (SpotifyMeta && SpotifyAccounts.length === 1) {
    MenuGroup.props.children = [
      MenuItems.play(SpotifyMeta, SpotifyAccounts[0]),
      MenuItems.addToQueue(SpotifyMeta, SpotifyAccounts[0]),
    ];
  } else if (SpotifyMeta) {
    MenuGroup.props.children = SpotifyAccounts.map((SpotifyAccount) => (
      <ContextMenu.MenuItem
        label={SpotifyAccount.name}
        id={`spotify-account-${SpotifyAccount.name}`}>
        {...[
          MenuItems.play(SpotifyMeta, SpotifyAccount),
          MenuItems.addToQueue(SpotifyMeta, SpotifyAccount),
        ]}
      </ContextMenu.MenuItem>
    ));
  }
};

export default { error, play, queue, mapMenuItems, openContextMenu, manipulateMenu };
