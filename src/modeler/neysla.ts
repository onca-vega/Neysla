import { NeyslaModeler } from "./modeler";
import { NeyslaModel } from "./model";
import { NeyslaDirectAPI } from "../direct";
import type { NeyslaConfig, NeyslaRequestOptions, NeyslaResponse } from "../types";

export interface NeyslaService {
  setModel(name: string | string[]): NeyslaModel;
}

type ModelerMap = Record<string, NeyslaService>;

function validateConfig(config: NeyslaConfig, index: number): void {
  if (!config.name || typeof config.name !== "string") {
    throw new TypeError(
      `Neysla: Initializator with index ${index} has no properly defined name.`
    );
  }
  if (typeof config.url !== "string") {
    throw new TypeError(
      `Neysla: Initializator with name ${config.name} has no properly defined url.`
    );
  }
  if (
    config.headers !== undefined &&
    (typeof config.headers !== "object" || Array.isArray(config.headers))
  ) {
    throw new TypeError(
      `Neysla: Initializator with name ${config.name} has no properly defined headers.`
    );
  }
  if (
    config.params !== undefined &&
    (typeof config.params !== "object" || Array.isArray(config.params))
  ) {
    throw new TypeError(
      `Neysla: Initializator with name ${config.name} has no properly defined params.`
    );
  }
  if (config.requestType !== undefined && typeof config.requestType !== "string") {
    throw new TypeError(
      `Neysla: Initializator with name ${config.name} has no properly defined requestType.`
    );
  }
  if (config.responseType !== undefined && typeof config.responseType !== "string") {
    throw new TypeError(
      `Neysla: Initializator with name ${config.name} has no properly defined responseType.`
    );
  }
  if (
    config.body !== undefined &&
    (typeof config.body !== "object" || Array.isArray(config.body))
  ) {
    throw new TypeError(
      `Neysla: Initializator with name ${config.name} has no properly defined body.`
    );
  }
}

export class Neysla {
  async init(config: NeyslaConfig | NeyslaConfig[]): Promise<ModelerMap> {
    if (
      config === null ||
      config === undefined ||
      typeof config !== "object"
    ) {
      throw new TypeError(
        "Neysla: You must set an Array or an Object to initializate your modelers."
      );
    }

    const configs: NeyslaConfig[] = Array.isArray(config) ? config : [config];

    if (configs.length === 0) {
      throw new TypeError("Neysla: Array of initializators is empty.");
    }

    for (let i = 0; i < configs.length; i++) {
      validateConfig(configs[i], i);
    }

    const modelers: ModelerMap = {};
    for (const c of configs) {
      modelers[c.name] = new NeyslaModeler(c);
    }

    return modelers;
  }

  // Métodos estáticos heredados de NeyslaDirectAPI
  static get<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return NeyslaDirectAPI.get<T>(data);
  }
  static head<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return NeyslaDirectAPI.head<T>(data);
  }
  static post<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return NeyslaDirectAPI.post<T>(data);
  }
  static patch<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return NeyslaDirectAPI.patch<T>(data);
  }
  static put<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return NeyslaDirectAPI.put<T>(data);
  }
  static remove<T = unknown>(data: NeyslaRequestOptions): Promise<NeyslaResponse<T>> {
    return NeyslaDirectAPI.remove<T>(data);
  }
}
