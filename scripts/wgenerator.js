/**
 * 文字列生成器クラス
 */
class WordGenerator {
    /**
     * 単純文字列生成を行うメソッド
     * @param setting 文字列を生成する時に使用する設定
     * @return 生成した文字列
     */
    static simple(setting) {
        let letters = setting.letters.split(",");
        let buffer = "";
        let countList = setting.patterns.split(",");
        let count = parseInt(countList[Math.floor(Math.random() * countList.length)]);
        let prohibitions = WordGenerator.getProhibitions(setting.prohibitions);
        let prohibitionsFirstMax = prohibitions.first.length === 0 ? -1 : prohibitions.first.map((x) => x.length).reduce((old, current) => Math.max(old, current));
        for (let i = 0; i < count; i++) {
            let letter = letters[Math.floor(Math.random() * letters.length)];
            buffer += letter;
            let isOk = WordGenerator.checkProhibition(buffer, prohibitions, count, i);
            if (!isOk) {
                buffer = buffer.substr(0, buffer.length - letter.length);
                i--;
            }
        }
        return buffer;
    }
    /**
     * 母子音別定義単純文字列生成を行うメソッド
     * @param setting 文字列を生成する時に使用する設定
     * @return 生成した文字列
     */
    static simplecv(setting) {
        let consonants = setting.consonants.split(",");
        let vowels = setting.vowels.split(",");
        let letters = consonants.concat(vowels);
        let buffer = "";
        let patternList = setting.patterns.split(",");
        let pattern = patternList[Math.floor(Math.random() * patternList.length)];
        let prohibitions = WordGenerator.getProhibitions(setting.prohibitions);
        for (let i = 0; i < pattern.length; i++) {
            let letter;
            switch (pattern[i].toUpperCase()) {
                case "C":
                    letter = consonants[Math.floor(Math.random() * consonants.length)];
                    break;
                case "V":
                    letter = vowels[Math.floor(Math.random() * vowels.length)];
                    break;
                case "*":
                    letter = letters[Math.floor(Math.random() * letters.length)];
                    break;
                default:
                    letter = "-";
                    break;
            }
            buffer += letter;
            let isOk = WordGenerator.checkProhibition(buffer, prohibitions, pattern.length, i);
            if (!isOk) {
                buffer = buffer.substr(0, buffer.length - letter.length);
                i--;
            }
        }
        return buffer;
    }
    /**
     * 母子音別定義依存遷移型文字列生成を行うメソッド
     * @param setting 文字列を生成する時に使用する設定
     * @return 生成した文字列
     */
    static dependencycv(setting) {
        let consonants = setting.consonants.split(",").map((x) => x.trim());
        let vowels = setting.vowels.split(",").map((x) => x.trim());
        let letters = consonants.concat(vowels);
        let buffer = "";
        let patternList = setting.patterns.split(",").map((x) => x.trim());
        let pattern = patternList[Math.floor(Math.random() * patternList.length)];
        let prohibitions = WordGenerator.getProhibitions(setting.prohibitions);
        let oldLetter = "";
        for (let i = 0; i < pattern.length; i++) {
            let letterList = null;
            if (oldLetter === "") {
                switch (pattern[i].toUpperCase()) {
                    case "C":
                        letterList = consonants;
                        break;
                    case "V":
                        letterList = vowels;
                        break;
                    case "*":
                        letterList = letters;
                        break;
                    default:
                        letterList = ["-"];
                        break;
                }
            }
            else {
                let nextLetters = null;
                setting.transitions.forEach((x) => {
                    if (x.letter === oldLetter) {
                        nextLetters = x.nextLetters.split(",");
                        return;
                    }
                });
                if (nextLetters !== null) {
                    switch (pattern[i].toUpperCase()) {
                        case "C":
                            letterList = nextLetters.filter((c) => {
                                return consonants.indexOf(c) !== -1;
                            });
                            break;
                        case "V":
                            letterList = nextLetters.filter((c) => {
                                return vowels.indexOf(c) !== -1;
                            });
                            break;
                        case "*":
                            letterList = nextLetters;
                            break;
                        default:
                            letterList = ["-"];
                            break;
                    }
                }
            }
            if (letterList === null || letterList.length === 0) {
                letterList = ["-"];
            }
            let letter = letterList[Math.floor(Math.random() * letterList.length)];
            buffer += letter;
            let isOk = WordGenerator.checkProhibition(buffer, prohibitions, pattern.length, i);
            if (!isOk) {
                buffer = buffer.substr(0, buffer.length - letter.length);
                i--;
            }
            else {
                oldLetter = letter;
            }
        }
        return buffer;
    }
    /**
     * スライム型文字列生成を行うメソッド
     * @param setting 文字列を生成する時に使用する設定
     * @return 生成した文字列
     */
    static slaim(setting) {
        return "";
    }
    /**
     * 禁則文字列の一覧から禁則文字列設定を取得する
     * @param prohibitions 禁則文字列の一覧
     * @return 禁則文字列設定
     */
    static getProhibitions(prohibitions) {
        if (prohibitions == null || prohibitions.trim().length === 0) {
            return {
                first: [],
                last: [],
                always: [],
            };
        }
        else {
            let split = prohibitions.split(",").map((x) => x.trim());
            let first = split.filter((x) => x.startsWith("^")).map((x) => x.substring(1));
            let last = split.filter((x) => x.endsWith("$")).map((x) => x.substring(0, x.length - 1));
            return {
                first: first,
                last: last,
                always: split.filter((x) => !(x.startsWith("^") || x.endsWith("$")))
            };
        }
    }
    /**
     * 禁則文字列が含まれていないかチェックする
     * @param buffer 作成中の単語文字列
     * @param prohibitions 禁則文字列設定
     * @param length 作成する単語文字列の長さ
     * @param count 現在の位置
     */
    static checkProhibition(buffer, prohibitions, length, count) {
        let prohibitionsFirstMax = prohibitions.first.length === 0 ? -1 : prohibitions.first.map((x) => x.length).reduce((old, current) => Math.max(old, current));
        let isFirst = prohibitions.first.length === 0 || prohibitionsFirstMax < count || prohibitions.first.every((x) => {
            return !buffer.startsWith(x);
        });
        let isAlways = prohibitions.always.length === 0 || prohibitions.always.every((x) => {
            return !buffer.endsWith(x);
        });
        let isLast = prohibitions.last.length === 0 || count !== length - 1 || prohibitions.last.every((x) => {
            return !buffer.endsWith(x);
        });
        return isFirst && isAlways && isLast;
    }
}
/**
 * 単純文字列生成を表すシンボル
 */
WordGenerator.SIMPLE_SYMBOL = "simple";
/**
 * 母子音文字別定義単純文字列生成を表すシンボル
 */
WordGenerator.SIMPLECV_SYMBOL = "simplecv";
/**
 * 母子音文字別定義依存遷移型文字列生成を表すシンボル
 */
WordGenerator.DEPENDENCYCV_SYMBOL = "dependencycv";
//# sourceMappingURL=wgenerator.js.map