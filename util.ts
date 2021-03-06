import networkConfig, { developmentChains } from "./networks";

export const isDevelopementChain = (chainId: string): boolean => {
  return developmentChains.indexOf(networkConfig[chainId].name) !== -1;
};

export const getNetworkIdFromName = (networkIdName: string): string | null => {
  for (const id in networkConfig) {
    if (networkConfig[id].name === networkIdName) {
      return id;
    }
  }
  return null;
};

export const sleep = async (time: number /* in seconds */): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });
};

export const formatJsonSvg = (data: Record<string, string>[][]): string[][] => {
  return data.map((part) =>
    part.map((path) => {
      const { d = "", fill = "", fillOpacity = "" } = path;
      return `d="${d}"${fill ? ` fill="${fill}"` : ""}${
        fillOpacity ? ` fill-opacity="${fillOpacity}"` : ""
      }`;
    })
  );
};
