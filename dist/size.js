"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.size = void 0;
const printable_characters_1 = require("printable-characters");
const create = (width, height) => [width, height];
const get = (str, isSplit = false) => {
    let lines = str;
    if (!isSplit) {
        lines = String(str).split('\n');
    }
    const height = lines.length;
    let width = 0;
    for (let index = 0; index < height; index++) {
        const line = lines[index];
        const lineLength = (0, printable_characters_1.strlen)(line);
        if (lineLength > width) {
            width = lineLength;
        }
    }
    return [width, height];
};
const max = (sizeA, sizeB) => {
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
exports.size = {
    create,
    get,
    max,
};
