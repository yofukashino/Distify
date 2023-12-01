export { types as DefaultTypes } from "replugged";
import { types as DefaultTypes } from "replugged";
export type { Channel, Message } from "discord-types/general";
import { Store } from "replugged/dist/renderer/modules/common/flux";
export interface SpotifyAccounts {
  accessToken?: string;
  friendSync: boolean;
  id: string;
  integrations: [];
  metadata?: unknown;
  metadataVisibility: number;
  name: string;
  revoked: boolean;
  showActivity: boolean;
  twoWayLink: boolean;
  type: string;
  verified: string;
  visibility: number;
}
export interface ConnectedAccountsStore extends Store {
  getAccount: DefaultTypes.AnyFunction;
  getAccounts: () => SpotifyAccounts[];
  getLocalAccount: DefaultTypes.AnyFunction;
  getLocalAccounts: DefaultTypes.AnyFunction;
  isFetching: DefaultTypes.AnyFunction;
  isJoining: DefaultTypes.AnyFunction;
  isSuggestedAccountType: DefaultTypes.AnyFunction;
}

export interface ElementParser {
  ReactMarkdown: DefaultTypes.AnyFunction;
  anyScopeRegex: DefaultTypes.AnyFunction;
  blockRegex: DefaultTypes.AnyFunction;
  defaultBlockParse: DefaultTypes.AnyFunction;
  defaultHtmlOutput: DefaultTypes.AnyFunction;
  defaultImplicitParse: DefaultTypes.AnyFunction;
  defaultInlineParse: DefaultTypes.AnyFunction;
  defaultOutput: DefaultTypes.AnyFunction;
  defaultParse: DefaultTypes.AnyFunction;
  defaultRawParse: DefaultTypes.AnyFunction;
  defaultReactOutput: DefaultTypes.AnyFunction;
  htmlFor: DefaultTypes.AnyFunction;
  htmlTag: DefaultTypes.AnyFunction;
  inlineRegex: DefaultTypes.AnyFunction;
  markdownToHtml: DefaultTypes.AnyFunction;
  markdownToReact: DefaultTypes.AnyFunction;
  outputFor: DefaultTypes.AnyFunction;
  parseBlock: DefaultTypes.AnyFunction;
  parseInline: DefaultTypes.AnyFunction;
  parserFor: DefaultTypes.AnyFunction;
  preprocess: DefaultTypes.AnyFunction;
  reactElement: DefaultTypes.AnyFunction;
  reactFor: DefaultTypes.AnyFunction;
  ruleOutput: DefaultTypes.AnyFunction;
  sanitizeText: DefaultTypes.AnyFunction;
  sanitizeUrl: DefaultTypes.AnyFunction;
  unescapeUrl: DefaultTypes.AnyFunction;
}
export * as default from "./types";
