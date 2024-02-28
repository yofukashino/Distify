import { PluginInjectorUtils } from "../index";
import Utils from "../lib/utils";
import Types from "../types";

export default (): void => {
  PluginInjectorUtils.addMenuItem(
    Types.DefaultTypes.ContextMenuTypes.Message,
    (data, menu: Types.MenuProps) => {
      Utils.manipulateMenu(data.message as Types.Message, menu);
    },
  );
};
