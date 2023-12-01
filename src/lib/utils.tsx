import { contextMenu as ContextMenuUtils } from "replugged/common";
import { ContextMenu } from "replugged/components";
import { PluginLogger } from "../index";
import { BASE_URL, BASE_URL_PLAYER } from "./consts";
import { ConnectedAccountsStore } from "./requiredModules";
import MenuItems from "../Components/MenuItems";
import Types from "../types";
import { util } from "replugged";
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

export const mapMenuItems = async (
  SpotifyLinks: string[][],
  SpotifyAccounts: Types.SpotifyAccounts[],
  type: {
    queue: boolean;
    play: boolean;
  },
): Promise<React.ReactElement[]> => {
  try {
    if (SpotifyAccounts.length <= 0) {
      return [MenuItems.noAccounts()];
    }

    const SpotifyMeta = await Promise.all(
      SpotifyLinks.map<Promise<string[]>>(async ([_, type, id]) => {
        try {
          const SpotifyResponse = await fetch(`${BASE_URL}/${type}s/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SpotifyAccounts[0].accessToken}`,
            },
          })
            .then((res) => res.json())
            .catch(() => ({ name: "Error Fetching Name" }));
          return [_, type, id, SpotifyResponse?.name ?? "Error Fetching Name"];
        } catch {
          return [_, type, id, "Error Fetching Name"];
        }
      }),
    );

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

export const openContextMenu = async (
  event: React.MouseEvent,
  SpotifyLinks: string[][],
  SpotifyAccounts: Types.SpotifyAccounts[],
  type: {
    queue: boolean;
    play: boolean;
  },
): Promise<void> => {
  const MappedItems = await mapMenuItems(SpotifyLinks, SpotifyAccounts, type);
  event.currentTarget = document.querySelector(`#distify-${type.play ? "play" : "queue"}`);
  const MyContextMenu = (props) => (
    <ContextMenu.ContextMenu {...props} navId={"tharki-distify"}>
      {...MappedItems}
    </ContextMenu.ContextMenu>
  );
  ContextMenuUtils.open(event, (e) => <MyContextMenu {...e} onClose={ContextMenuUtils.close} />);
};

export const manipulateMenu = async (
  message: Types.Message,
  menu: { children: React.ReactElement[] },
): Promise<void> => {
  if (menu?.children?.some?.((c) => c?.props?.id === "distify")) return;
  const SpotifyLinks = Array.from(
    message.content.matchAll(/open.spotify.com\/(album|track|playlist)\/([^?]+)/g) as string[][] &
      IterableIterator<RegExpMatchArray>,
  );
  if (SpotifyLinks.length <= 0) return;
  const SpotifyAccounts = ConnectedAccountsStore.getAccounts().filter((a) => a.type === "spotify");
  const Index = menu.children.findIndex(
    (c) => c?.props?.id === "replugged" || c?.props?.id?.includes?.("devmode-copy-id"),
  );
  const MappedItems = await mapMenuItems(SpotifyLinks, SpotifyAccounts, {
    play: true,
    queue: true,
  });
  const MenuGroup = <ContextMenu.MenuGroup>{...MappedItems}</ContextMenu.MenuGroup>;
  MenuGroup.props.id = "distify";
  if (!menu?.children?.some?.((c) => c?.props?.id === "distify"))
    menu?.children?.splice?.(Index, 0, MenuGroup);

  const MenuElement = document.querySelector(
    `#${Types.DefaultTypes.ContextMenuTypes.Message}`,
  )?.parentElement;
  if (!MenuElement) return;
  const MouseOver = new MouseEvent("mouseover", {
    bubbles: true,
  });
  const MouseOut = new MouseEvent("mouseout", {
    bubbles: true,
  });
  const RandomMenuItem = MenuElement.querySelector(`[class*="item"]`);
  RandomMenuItem.dispatchEvent(MouseOver);
  RandomMenuItem.dispatchEvent(MouseOut);
  await util.waitFor("#message-play-on-spotify");
  const mHeight = MenuElement.offsetHeight + 10;
  const wHeight = window.innerHeight;
  if (mHeight + MenuElement.offsetTop > wHeight) {
    const ypos = wHeight - mHeight;
    MenuElement.style.top = ypos < 0 ? "0px" : `${ypos}px`;
  }
};

export default { error, play, queue, mapMenuItems, openContextMenu, manipulateMenu };
