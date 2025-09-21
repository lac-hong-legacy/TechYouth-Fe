import 'dotenv/config';
import { ExpoConfig } from '@expo/config-types';

export default ({ config }: { config: ExpoConfig }): ExpoConfig => {
    return {
        ...config,
        extra: {
            API_URL: process.env.API_URL,
            API_URL_TOKEN: process.env.API_URL_TOKEN,
        },
    };
};