import { ContextMenu } from "replugged/components";
import { PluginInjectorUtils } from "../index";
import Modules from "../lib/requiredModules";
import MenuItems from "../Components/MenuItems";
import Utils from "../lib/utils";
import Types from "../types";

export default (): void => {
  PluginInjectorUtils.addMenuItem(
    Types.DefaultTypes.ContextMenuTypes.Message,
    ({ message }: { message: Types.Message }, menu: Types.MenuProps): React.ReactElement | void => {
      const MenuGroup = menu?.children?.find?.((c) => c?.props?.id === "distify") ?? (
        <ContextMenu.MenuGroup />
      );
      MenuGroup.props.id = "distify";
      if (!menu?.children?.some?.((c) => c?.props?.id === "distify"))
        menu?.children.splice(-1, 0, MenuGroup);
      const SpotifyLinks = Array.from(
        message.content.matchAll(
          /open.spotify.com(?:\/intl-it)?\/(album|track|playlist)\/([^?]+)/g,
        ) as IterableIterator<string[]>,
      );
      const SpotifyAccounts = Modules.ConnectedAccountsStore?.getAccounts().filter(
        (a) => a.type === "spotify",
      );
      if (!SpotifyAccounts.length) {
        MenuGroup.props.children = [MenuItems.noAccounts()];
      }
      const SpotifyMeta = Utils.mapMenuItems<string[][]>(SpotifyLinks, SpotifyAccounts, {
        data: true,
      });
      if (SpotifyLinks.length <= 0) return;
      if (SpotifyMeta) {
        MenuGroup.props.children = [MenuItems.play(SpotifyMeta), MenuItems.queue(SpotifyMeta)];
      }
    },
  );
};
