import { types } from "replugged";
import util from "replugged/util";
import GeneralDiscordTypes from "discord-types/general";
import { ChannelMessages as ChannelMessagesType } from "replugged/dist/renderer/modules/common/messages";
import { ContextMenuProps } from "replugged/dist/renderer/modules/components/ContextMenu";
import { Store } from "replugged/dist/renderer/modules/common/flux";
export namespace Types {
  export import DefaultTypes = types;
  export type Guild = GeneralDiscordTypes.Guild;
  export type Channel = GeneralDiscordTypes.Channel;
  export type User = GeneralDiscordTypes.User;
  export type Message = GeneralDiscordTypes.Message;
  export type UtilTree = util.Tree;
  export type ReactTree = util.Tree & React.ReactElement;
  export type ChannelMessages = typeof ChannelMessagesType;
  export type MenuProps = ContextMenuProps["ContextMenu"] & { children: React.ReactElement[] };
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
}
export default Types;
