import addContextMenu from "./ContextMenu";
import patchElementParser from "./ElementParser";
import addPopover from "./Popover";

export const applyInjections = (): void => {
  addContextMenu();
  patchElementParser();
  addPopover();
};
