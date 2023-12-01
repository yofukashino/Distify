import { webpack } from "replugged";
import Types from "../types";

export const ConnectedAccountsStore =
  webpack.getByStoreName<Types.ConnectedAccountsStore>("ConnectedAccountsStore");

export const ElementParser = webpack.getByProps<Types.ElementParser>("sanitizeUrl", "sanitizeText");
