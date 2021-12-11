import util from 'util';
import {colorize, Colors} from './colors';

export const escapeRegex = (string: string) => {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const regex = (search: string, left = '', right = '') => {
    return new RegExp(`${left}${escapeRegex(search)}${right}`, 'gmi');
};

export const output = {
    print(str: string, color?: Colors | null) {
        this.write(str + '\n', color);
    },
    write(str: string | number, color?: Colors | null) {
        str = String(str);
        str = color ? colorize(str, color) : str;
        process.stdout.write(str);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(str: any, depth = 10) {
        this.print(util.inspect(str, false, depth, true));
    },
};
