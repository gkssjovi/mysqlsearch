import YAML from 'yaml';
import os from 'os';
import path from 'path';
import fs from 'fs';

const configPath = path.join(os.homedir(), `/.config/mysqlsearch/config.yaml`);

export type ConfigValue =
    | string
    | string[]
    | Record<string, any>
    | number
    | number[]
    | boolean
    | undefined
    | null;

export interface Config {
    host?: string;
    database?: string;
    user?: string;
    password?: string;
    port?: number;
    limit?: number;
    formatRow?: string;
    formatCell?: string;
    trimMatchContext?: boolean;
    table?: string;
    theme?: string;
}

let data: Config = {};

if (fs.existsSync(configPath)) {
    const read = fs.readFileSync(configPath, 'utf-8');
    data = YAML.parse(read) as Config;
    if (!data) {
        data = {};
    }
}

export const getConfig = (
    option?: keyof Config,
    defaultValue?: ConfigValue
): ConfigValue | undefined => {
    if (typeof option === 'undefined') {
        return data;
    }

    if (typeof data[option] !== 'undefined') {
        return data[option];
    }

    return defaultValue;
};

export const setConfig = (key: string, value: ConfigValue) => {
    (data as Record<string, ConfigValue>)[key] = value;
    const str = YAML.stringify(data);
    fs.writeFileSync(configPath, str);
};
