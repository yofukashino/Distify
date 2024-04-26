import { webpack } from "replugged";
import Types from "../types";

export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.ElementParser ??= await webpack.waitForProps<Types.ElementParser>(
    "sanitizeUrl",
    "sanitizeText",
  );
  Modules.ConnectedAccountsStore ??=
    webpack.getByStoreName<Types.ConnectedAccountsStore>("ConnectedAccountsStore");
  Modules.SpotifyStore ??= webpack.getByStoreName<Types.SpotifyStore>("SpotifyStore");
};

export default Modules;
