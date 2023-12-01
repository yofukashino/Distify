import { PluginInjector } from "../index";
import { ElementParser } from "../lib/requiredModules";
export default (): void => {
  PluginInjector.after(ElementParser, "sanitizeUrl", ([link]: [string], res) => {
    const [_, type, id] =
      link.match(/open.spotify.com\/(track|album|artist|playlist|user|episode)\/([^?]+)/) ?? [];
    return !type || !id ? res : `spotify:${type}:${id}`;
  });
};
