import { toast as ToastUtils } from "replugged/common";
import { PluginInjectorUtils, PluginLogger } from "../index";
import Modules from "../lib/requiredModules";
import Utils from "../lib/utils";
import Icons from "../Components/Icons";
import Types from "../types";
export default (): void => {
  const { ConnectedAccountsStore } = Modules;
  PluginInjectorUtils.addPopoverButton((message: Types.Message) => {
    const SpotifyLinks = Array.from(
      message.content.matchAll(
        /open.spotify.com(?:\/intl-it)?\/(album|track|playlist)\/([^?]+)/g,
      ) as string[][] & IterableIterator<RegExpMatchArray>,
    );
    if (SpotifyLinks.length <= 0) return null;
    const SpotifyAccounts = ConnectedAccountsStore.getAccounts().filter(
      (a) => a.type === "spotify",
    );
    return {
      id: "distify-play",
      key: "distify-play",
      label: `Play ${SpotifyLinks.length > 1 ? "All " : ""}on Spotify`,
      icon: () => <Icons.play width="22" height="22" />,
      onClick: async () => {
        if (SpotifyAccounts.length <= 0) {
          ToastUtils.toast("Connect Spotify Account First.", ToastUtils.Kind.FAILURE, {
            duration: 5000,
          });
        } else {
          try {
            const [play, ...queue] = SpotifyLinks;
            const [, type, id] = play;
            await Utils.play(type, id);
            for (const [, type, id] of queue ?? []) {
              if (type === "track") await Utils.queue(type, id);
              else await Utils.fetchTracksAndQueue(type, id);
            }
            ToastUtils.toast("Successfully Played on Spotify", ToastUtils.Kind.SUCCESS, {
              duration: 5000,
            });
          } catch (err) {
            ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
              duration: 5000,
            });
            PluginLogger.error(err);
          }
        }
      },
      onContextMenu: (e) => {
        Utils.openContextMenu(e, SpotifyLinks, SpotifyAccounts, { play: true, queue: false });
      },
    };
  });
  PluginInjectorUtils.addPopoverButton((message: Types.Message) => {
    const SpotifyLinks = Array.from(
      message.content.matchAll(
        /open.spotify.com(?:\/intl-it)?\/(album|track|playlist)\/([^?]+)/g,
      ) as string[][] & IterableIterator<RegExpMatchArray>,
    );
    if (SpotifyLinks.length <= 0) return null;
    const SpotifyAccounts = ConnectedAccountsStore.getAccounts().filter(
      (a) => a.type === "spotify",
    );
    return {
      id: "distify-queue",
      key: "distify-queue",
      label: `Queue ${SpotifyLinks.length > 1 ? "All " : ""}on Spotify`,
      icon: () => <Icons.queue width="22" height="22" />,
      onClick: async () => {
        if (SpotifyAccounts.length <= 0) {
          ToastUtils.toast("Connect Spotify Account First.", ToastUtils.Kind.FAILURE, {
            duration: 5000,
          });
        } else {
          try {
            for (const [, type, id] of SpotifyLinks) {
              if (type === "track") await Utils.queue(type, id);
              else await Utils.fetchTracksAndQueue(type, id);
            }
            ToastUtils.toast("Successfully Queued on Spotify", ToastUtils.Kind.SUCCESS, {
              duration: 5000,
            });
          } catch (err) {
            ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
              duration: 5000,
            });
            PluginLogger.error(err);
          }
        }
      },
      onContextMenu: (e) => {
        Utils.openContextMenu(e, SpotifyLinks, SpotifyAccounts, { play: false, queue: true });
      },
    };
  });
};
