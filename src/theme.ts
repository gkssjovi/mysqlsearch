import {output} from './helpers';

export enum ThemeType {
    TOP,
    MIDDLE,
    BOTTOM,
}

export enum Theme {
    SOLID = 'solid',
    DEFAULT = 'default',
    DASHED = 'dashed',
}

export enum ThemeSeparatorPostion {
    LEFT,
    MIDDLE,
    RIGHT,
}

export const themeOptions = Object.values(Theme);

export const createTheme = (sizes: CellSize[], style: Theme) => {
    return {
        print(type: ThemeType) {
            if (type == ThemeType.TOP) {
                switch (style) {
                    case Theme.DASHED:
                        output.print(
                            '+-' + sizes.map((size) => '-'.repeat(size[0])).join('-+-') + '-+'
                        );
                        break;
                    case Theme.SOLID:
                        output.print(
                            '╭─' + sizes.map((size) => '─'.repeat(size[0])).join('─┬─') + '─╮'
                        );
                        break;
                    default:
                    case Theme.DEFAULT:
                        output.print(
                            '╭─' + sizes.map((size) => '─'.repeat(size[0])).join('───') + '─╮'
                        );
                        break;
                }
            }

            if (type == ThemeType.MIDDLE) {
                switch (style) {
                    case Theme.DASHED:
                        output.print(
                            '+-' + sizes.map((size) => '-'.repeat(size[0])).join('-+-') + '-+'
                        );
                        break;
                    case Theme.SOLID:
                        output.print(
                            '├─' + sizes.map((size) => '─'.repeat(size[0])).join('─┼─') + '─┤'
                        );
                        break;
                    case Theme.DEFAULT:
                    default:
                        output.print(
                            '├─' + sizes.map((size) => '─'.repeat(size[0])).join('───') + '─┤'
                        );
                        break;
                }
            }

            if (type == ThemeType.BOTTOM) {
                switch (style) {
                    case Theme.DASHED:
                        output.print(
                            '+-' + sizes.map((size) => '-'.repeat(size[0])).join('-+-') + '-+'
                        );
                        break;
                    case Theme.SOLID:
                        output.print(
                            '╰─' + sizes.map((size) => '─'.repeat(size[0])).join('─┴─') + '─╯'
                        );
                        break;
                    case Theme.DEFAULT:
                    default:
                        output.print(
                            '╰─' + sizes.map((size) => '─'.repeat(size[0])).join('───') + '─╯'
                        );
                        break;
                }
            }
        },

        getSeparator(postion: ThemeSeparatorPostion) {
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
