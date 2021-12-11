import {strlen} from 'printable-characters';

const create = (width: number, height: number): CellSize => [width, height];

const get = (str: string | string[], isSplit = false): CellSize => {
    let lines = str;

    if (!isSplit) {
        lines = String(str).split('\n');
    }

    const height = lines.length;
    let width = 0;
    for (let index = 0; index < height; index++) {
        const line = lines[index];
        const lineLength = strlen(line);
        if (lineLength > width) {
            width = lineLength;
        }
    }

    return [width, height];
};

const max = (sizeA: CellSize, sizeB: CellSize): CellSize => {
    let width = sizeB[0];
    let height = sizeB[1];

    if (sizeA[0] > sizeB[0]) {
        width = sizeA[0];
    }
    if (sizeA[1] > sizeB[1]) {
        height = sizeA[1];
    }

    return [width, height];
};

export const size = {
    create,
    get,
    max,
};
