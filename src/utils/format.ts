import { networkDataMap } from "../data";
import { NetworkCode } from "../types";

export function getNetworkData(network: string | NetworkCode) {
  return networkDataMap[network] ?? { network, name: network };
}

export function isAfterDate(date1: string, date2: string) {
  return new Date(date1) > new Date(date2);
}
