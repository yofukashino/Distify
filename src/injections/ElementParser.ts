import { PluginInjector } from "../index";
import Modules from "../lib/requiredModules";
export default (): void => {
  PluginInjector.after(Modules.ElementParser, "sanitizeUrl", ([link]: [string], res) => {
    const [_, type, id] =
      link.match(
        /open.spotify.com(?:\/intl-it)?\/(track|album|artist|playlist|user|episode|show)\/([^?]+)/,
      ) ?? [];
    return !type || !id ? res : `spotify:${type}:${id}`;
  });
};
