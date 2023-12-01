import { Injector, Logger } from "replugged";
export const PluginLogger = Logger.plugin("Distify");
export const PluginInjector = new Injector();
export const PluginInjectorUtils = PluginInjector.utils;
import { applyInjections } from "./patches/index";

export const start = (): void => {
  applyInjections();
};

export const stop = (): void => {
  PluginInjector.uninjectAll();
};
