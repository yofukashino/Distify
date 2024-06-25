import { webpack } from "replugged";
import Types from "../types";

export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.ElementParser ??= await webpack
    .waitForProps<Types.ElementParser>(["sanitizeUrl", "sanitizeText"], {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ElementParser Module");
    });

  Modules.ConnectedAccountsUtils ??= await webpack
    .waitForProps<Types.ConnectedAccountsUtils>(["setShowActivity", "refreshAccessToken"], {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find ConnectedAccountsUtils Module");
    });

  Modules.ConnectedAccountsStore ??=
    webpack.getByStoreName<Types.ConnectedAccountsStore>("ConnectedAccountsStore");
  Modules.SpotifyStore ??= webpack.getByStoreName<Types.SpotifyStore>("SpotifyStore");
};

export default Modules;
