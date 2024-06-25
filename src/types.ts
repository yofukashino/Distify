import { types } from "replugged";
import { ChannelMessages as ChannelMessagesType } from "replugged/dist/renderer/modules/common/messages";
import { ContextMenuProps } from "replugged/dist/renderer/modules/components/ContextMenu";
import { Store } from "replugged/dist/renderer/modules/common/flux";
import util from "replugged/util";
import GeneralDiscordTypes from "discord-types/general";

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
  export interface SpotifyStore extends Store {
    canPlay: DefaultTypes.AnyFunction;
    getActiveSocketAndDevice: () => { socket: SpotifySocket; device: SpotifyDevice };
    getActivity: DefaultTypes.AnyFunction;
    getLastPlayedTrackId: DefaultTypes.AnyFunction;
    getPlayableComputerDevices: () => Array<{ socket: SpotifySocket; device: SpotifyDevice }>;
    getPlayerState: DefaultTypes.AnyFunction;
    getSyncingWith: DefaultTypes.AnyFunction;
    getTrack: DefaultTypes.AnyFunction;
    hasConnectedAccount: DefaultTypes.AnyFunction;
    initialize: DefaultTypes.AnyFunction;
    shouldShowActivity: DefaultTypes.AnyFunction;
    wasAutoPaused: DefaultTypes.AnyFunction;
  }
  export interface ConnectedAccountsUtils {
    authorize: DefaultTypes.AnyFunction;
    callback: DefaultTypes.AnyFunction;
    completeTwoWayLink: DefaultTypes.AnyFunction;
    connect: DefaultTypes.AnyFunction;
    disconnect: DefaultTypes.AnyFunction;
    fetch: DefaultTypes.AnyFunction;
    joinServer: DefaultTypes.AnyFunction;
    linkDispatchAuthCallback: DefaultTypes.AnyFunction;
    refresh: DefaultTypes.AnyFunction;
    refreshAccessToken: DefaultTypes.AnyFunction;
    setFriendSync: DefaultTypes.AnyFunction;
    setMetadataVisibility: DefaultTypes.AnyFunction;
    setShowActivity: DefaultTypes.AnyFunction;
    setVisibility: DefaultTypes.AnyFunction;
    submitPinCode: DefaultTypes.AnyFunction;
    update: DefaultTypes.AnyFunction;
  }
  export interface SpotifySocket {
    accessToken: string;
    accountId: string;
    connectionId: string;
    handleDeviceStateChange: DefaultTypes.AnyFunction;
    isPremium: boolean;
    pingInterval: { _ref: number };
    socket: WebSocket;
    _requestedConnect: boolean;
    _requestedDisconnect: boolean;
    connect: DefaultTypes.AnyFunction;
    connected: boolean;
    disconnect: DefaultTypes.AnyFunction;
    handleClose: DefaultTypes.AnyFunction;
    handleEvent: DefaultTypes.AnyFunction;
    handleMessage: DefaultTypes.AnyFunction;
    handleOpen: DefaultTypes.AnyFunction;
    ping: DefaultTypes.AnyFunction;
  }
  export interface SpotifyDevice {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    supports_volume: boolean;
    type: string;
    volume_percent: number;
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
  export interface Modules {
    loadModules?: () => Promise<void>;
    ConnectedAccountsStore?: ConnectedAccountsStore;
    ConnectedAccountsUtils?: ConnectedAccountsUtils;
    ElementParser?: ElementParser;
    SpotifyStore?: SpotifyStore;
  }
}
export default Types;
