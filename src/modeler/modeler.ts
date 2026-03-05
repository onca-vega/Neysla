import { NeyslaModel } from "./model";
import type { NeyslaConfig } from "../types";

export class NeyslaModeler {
  readonly #config: NeyslaConfig;

  constructor(config: NeyslaConfig) {
    this.#config = config;
  }

  setModel(name: string | string[]): NeyslaModel {
    if (!(Array.isArray(name) || typeof name === "string")) {
      throw new TypeError(
        `Neysla: A model's name of ${this.#config.name} modeler is not properly defined.`
      );
    }
    return new NeyslaModel(this.#config, name);
  }
}
