import { networkDataMap } from "../data";
import { NetworkCode } from "../types";

export function getNetworkData(network: string | NetworkCode) {
  return networkDataMap[network] ?? { network, name: network };
}
