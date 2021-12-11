"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorize = exports.colorLength = exports.Colors = void 0;
const const_1 = require("./const");
var Colors;
(function (Colors) {
    Colors["Reset"] = "\u001B[0m";
    Colors["Bright"] = "\u001B[1m";
    Colors["Dim"] = "\u001B[2m";
    Colors["Underscore"] = "\u001B[4m";
    Colors["Blink"] = "\u001B[5m";
    Colors["Reverse"] = "\u001B[7m";
    Colors["Hidden"] = "\u001B[8m";
    Colors["FgBlack"] = "\u001B[30m";
    Colors["FgRed"] = "\u001B[31m";
    Colors["FgGreen"] = "\u001B[32m";
    Colors["FgYellow"] = "\u001B[33m";
    Colors["FgBlue"] = "\u001B[34m";
    Colors["FgMagenta"] = "\u001B[35m";
    Colors["FgCyan"] = "\u001B[36m";
    Colors["FgWhite"] = "\u001B[37m";
    Colors["BgBlack"] = "\u001B[40m";
    Colors["BgRed"] = "\u001B[41m";
    Colors["BgGreen"] = "\u001B[42m";
    Colors["BgYellow"] = "\u001B[43m";
    Colors["BgBlue"] = "\u001B[44m";
    Colors["BgMagenta"] = "\u001B[45m";
    Colors["BgCyan"] = "\u001B[46m";
    Colors["BgWhite"] = "\u001B[47m";
    Colors["Clear"] = "\u001B[0m";
})(Colors = exports.Colors || (exports.Colors = {}));
const colorLength = (color) => {
    if (const_1.redirected) {
        return 0;
    }
    return color.length + Colors.Clear.length;
};
exports.colorLength = colorLength;
const colorize = (str, color) => {
    if (const_1.redirected) {
        return str;
    }
    return `${color}${str}${Colors.Clear}`;
};
exports.colorize = colorize;
