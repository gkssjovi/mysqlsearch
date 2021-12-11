"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheme = exports.themeOptions = exports.ThemeSeparatorPostion = exports.Theme = exports.ThemeType = void 0;
const helpers_1 = require("./helpers");
var ThemeType;
(function (ThemeType) {
    ThemeType[ThemeType["TOP"] = 0] = "TOP";
    ThemeType[ThemeType["MIDDLE"] = 1] = "MIDDLE";
    ThemeType[ThemeType["BOTTOM"] = 2] = "BOTTOM";
})(ThemeType = exports.ThemeType || (exports.ThemeType = {}));
var Theme;
(function (Theme) {
    Theme["SOLID"] = "solid";
    Theme["DEFAULT"] = "default";
    Theme["DASHED"] = "dashed";
})(Theme = exports.Theme || (exports.Theme = {}));
var ThemeSeparatorPostion;
(function (ThemeSeparatorPostion) {
    ThemeSeparatorPostion[ThemeSeparatorPostion["LEFT"] = 0] = "LEFT";
    ThemeSeparatorPostion[ThemeSeparatorPostion["MIDDLE"] = 1] = "MIDDLE";
    ThemeSeparatorPostion[ThemeSeparatorPostion["RIGHT"] = 2] = "RIGHT";
})(ThemeSeparatorPostion = exports.ThemeSeparatorPostion || (exports.ThemeSeparatorPostion = {}));
exports.themeOptions = Object.values(Theme);
const createTheme = (sizes, style) => {
    return {
        print(type) {
            if (type == ThemeType.TOP) {
                switch (style) {
                    case Theme.DASHED:
                        helpers_1.output.print('+-' + sizes.map((size) => '-'.repeat(size[0])).join('-+-') + '-+');
                        break;
                    case Theme.SOLID:
                        helpers_1.output.print('╭─' + sizes.map((size) => '─'.repeat(size[0])).join('─┬─') + '─╮');
                        break;
                    default:
                    case Theme.DEFAULT:
                        helpers_1.output.print('╭─' + sizes.map((size) => '─'.repeat(size[0])).join('───') + '─╮');
                        break;
                }
            }
            if (type == ThemeType.MIDDLE) {
                switch (style) {
                    case Theme.DASHED:
                        helpers_1.output.print('+-' + sizes.map((size) => '-'.repeat(size[0])).join('-+-') + '-+');
                        break;
                    case Theme.SOLID:
                        helpers_1.output.print('├─' + sizes.map((size) => '─'.repeat(size[0])).join('─┼─') + '─┤');
                        break;
                    case Theme.DEFAULT:
                    default:
                        helpers_1.output.print('├─' + sizes.map((size) => '─'.repeat(size[0])).join('───') + '─┤');
                        break;
                }
            }
            if (type == ThemeType.BOTTOM) {
                switch (style) {
                    case Theme.DASHED:
                        helpers_1.output.print('+-' + sizes.map((size) => '-'.repeat(size[0])).join('-+-') + '-+');
                        break;
                    case Theme.SOLID:
                        helpers_1.output.print('╰─' + sizes.map((size) => '─'.repeat(size[0])).join('─┴─') + '─╯');
                        break;
                    case Theme.DEFAULT:
                    default:
                        helpers_1.output.print('╰─' + sizes.map((size) => '─'.repeat(size[0])).join('───') + '─╯');
                        break;
                }
            }
        },
        getSeparator(postion) {
            switch (style) {
                case Theme.DASHED:
                    return '|';
                case Theme.SOLID:
                    return '│';
                case Theme.DEFAULT:
                default:
                    switch (postion) {
                        case ThemeSeparatorPostion.LEFT:
                        case ThemeSeparatorPostion.RIGHT:
                            return '│';
                        case ThemeSeparatorPostion.MIDDLE:
                        default:
                            return '┆';
                    }
            }
        },
    };
};
exports.createTheme = createTheme;
