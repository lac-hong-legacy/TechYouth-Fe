import Constants from "expo-constants";

type EnvConfig = {
  API_URL: string;
  API_URL_TOKEN: string;
};

const extra = Constants.expoConfig?.extra as EnvConfig;

export const ENV = {
  API_URL: extra.API_URL,
  API_URL_TOKEN: extra.API_URL_TOKEN,
};
