import { toast as ToastUtils } from "replugged/common";
import { ContextMenu } from "replugged/components";
import { PluginLogger } from "../index";
import Utils from "../lib/utils";
import Icons from "./Icons";

export const noAccounts = (): React.ReactElement => {
  return (
    <ContextMenu.MenuItem
      label="No Accounts"
      subtext="You may connect a spotify account from connections tab in settings first."
      id="no-accounts"
      showIconFirst={true}
      icon={() => <Icons.noLive width="16" height="16" />}
    />
  );
};

export const queue = (SpotifyLinks: string[][]): React.ReactElement => {
  if (SpotifyLinks.length === 1) {
    const [, type, id, name] = SpotifyLinks[0];
    return (
      <ContextMenu.MenuItem
        label="Add to queue"
        subtext={name}
        id="queue-add"
        showIconFirst={true}
        icon={() => <Icons.queue width="16" height="16" />}
        action={async () => {
          try {
            await Utils.queue(type, id);
            ToastUtils.toast("Successfully Queued on Spotify", ToastUtils.Kind.SUCCESS, {
              duration: 5000,
            });
          } catch (err) {
            ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
              duration: 5000,
            });
            PluginLogger.error(err);
          }
        }}
      />
    );
  }
  return (
    <ContextMenu.MenuItem
      label="Add to queue"
      id="queue-add"
      showIconFirst={true}
      icon={() => <Icons.queue width="16" height="16" />}
      action={async () => {
        try {
          for (const [, type, id] of SpotifyLinks) await Utils.queue(type, id);
          ToastUtils.toast("Successfully Queued on Spotify", ToastUtils.Kind.SUCCESS, {
            duration: 5000,
          });
        } catch (err) {
          ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
            duration: 5000,
          });
          PluginLogger.error(err);
        }
      }}>
      {...SpotifyLinks.map(([, type, id, name]) => {
        return (
          <ContextMenu.MenuItem
            label={name}
            id={`queue-add=${name}`}
            showIconFirst={true}
            icon={() => <Icons.queue width="16" height="16" />}
            action={async () => {
              try {
                await Utils.queue(type, id);
                ToastUtils.toast("Successfully Queued on Spotify", ToastUtils.Kind.SUCCESS, {
                  duration: 5000,
                });
              } catch (err) {
                ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
                  duration: 5000,
                });
                PluginLogger.error(err);
              }
            }}
          />
        );
      })}
    </ContextMenu.MenuItem>
  );
};

export const play = (SpotifyLinks: string[][]): React.ReactElement => {
  if (SpotifyLinks.length === 1) {
    const [, type, id, name] = SpotifyLinks[0];
    return (
      <ContextMenu.MenuItem
        label="Play on spotify"
        subtext={name}
        id="play-on-spotify"
        showIconFirst={true}
        icon={() => <Icons.play width="16" height="16" />}
        action={async () => {
          try {
            await Utils.play(type, id);
            ToastUtils.toast("Successfully Played on Spotify", ToastUtils.Kind.SUCCESS, {
              duration: 5000,
            });
          } catch (err) {
            ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
              duration: 5000,
            });
            PluginLogger.error(err);
          }
        }}
      />
    );
  }
  return (
    <ContextMenu.MenuItem
      label="Play on spotify"
      id="play-on-spotify"
      showIconFirst={true}
      icon={() => <Icons.play width="16" height="16" />}
      action={async () => {
        try {
          for (const [, type, id] of SpotifyLinks) await Utils.play(type, id);
          ToastUtils.toast("Successfully Played on Spotify", ToastUtils.Kind.SUCCESS, {
            duration: 5000,
          });
        } catch (err) {
          ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
            duration: 5000,
          });
          PluginLogger.error(err);
        }
      }}>
      {...SpotifyLinks.map(([, type, id, name]) => {
        return (
          <ContextMenu.MenuItem
            label={name}
            id={`play-on-spotify-${name}`}
            showIconFirst={true}
            icon={() => <Icons.play width="16" height="16" />}
            action={async () => {
              try {
                await Utils.play(type, id);
                ToastUtils.toast("Successfully Played on Spotify", ToastUtils.Kind.SUCCESS, {
                  duration: 5000,
                });
              } catch (err) {
                ToastUtils.toast(`${err}`, ToastUtils.Kind.FAILURE, {
                  duration: 5000,
                });
                PluginLogger.error(err);
              }
            }}
          />
        );
      })}
    </ContextMenu.MenuItem>
  );
};

export default { noAccounts, queue, play };
