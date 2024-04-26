import Modules from "../lib/requiredModules";
import injectElementParser from "./ElementParser";
import injectMessageContextMenu from "./MessageContextMenu";
import injectPopover from "./Popover";

export const applyInjections = async (): Promise<void> => {
  await Modules.loadModules();
  injectMessageContextMenu();
  injectElementParser();
  injectPopover();
};

export default { applyInjections };
