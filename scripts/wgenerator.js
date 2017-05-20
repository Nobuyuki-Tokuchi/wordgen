/**
 * 文字列生成器クラス
 */
var WordGenerator = (function () {
    function WordGenerator() {
    }
    /**
     * 単純文字列生成を行うメソッド
     * @param setting 文字列を生成する時に使用する設定
     * @return 生成した文字列
     */
    WordGenerator.simple = function (setting) {
        var letters = setting.letters.split(",");
        var buffer = "";
        var countList = setting.patterns.split(",");
        var count = parseInt(countList[Math.floor(Math.random() * countList.length)]);
        for (var i = 0; i < count; i++) {
            buffer += letters[Math.floor(Math.random() * letters.length)];
        }
        return buffer;
    };
    /**
     * 母子音別定義単純文字列生成を行うメソッド
     * @param setting 文字列を生成する時に使用する設定
     * @return 生成した文字列
     */
    WordGenerator.simplecv = function (setting) {
        var consonants = setting.consonants.split(",");
        var vowels = setting.vowels.split(",");
        var letters = consonants.concat(vowels);
        var buffer = "";
        var patternList = setting.patterns.split(",");
        var pattern = patternList[Math.floor(Math.random() * patternList.length)];
        for (var i = 0; i < pattern.length; i++) {
            switch (pattern[i].toUpperCase()) {
                case "C":
                    buffer += consonants[Math.floor(Math.random() * consonants.length)];
                    break;
                case "V":
                    buffer += vowels[Math.floor(Math.random() * vowels.length)];
                    break;
                case "*":
                    buffer += letters[Math.floor(Math.random() * letters.length)];
                    break;
                default:
                    buffer += "-";
                    break;
            }
        }
        return buffer;
    };
    /**
     * 母子音別定義依存遷移型文字列生成を行うメソッド
     * @param setting 文字列を生成する時に使用する設定
     * @return 生成した文字列
     */
    WordGenerator.chaincv = function (setting) {
        var consonants = setting.consonants.split(",");
        var vowels = setting.vowels.split(",");
        var letters = consonants.concat(vowels);
        var buffer = "";
        var patternList = setting.patterns.split(",");
        var pattern = patternList[Math.floor(Math.random() * patternList.length)];
        var oldLetter = "";
        var _loop_1 = function (i) {
            var letterList = null;
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
                var nextLetters_1 = null;
                setting.transitions.forEach(function (x) {
                    if (x.letter === oldLetter) {
                        nextLetters_1 = x.nextLetters.split(",");
                        return;
                    }
                });
                if (nextLetters_1 !== null) {
                    switch (pattern[i].toUpperCase()) {
                        case "C":
                            letterList = nextLetters_1.filter(function (c) {
                                return consonants.indexOf(c) !== -1;
                            });
                            break;
                        case "V":
                            letterList = nextLetters_1.filter(function (c) {
                                return vowels.indexOf(c) !== -1;
                            });
                            break;
                        case "*":
                            letterList = nextLetters_1;
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
            oldLetter = letterList[Math.floor(Math.random() * letterList.length)];
            buffer += oldLetter;
        };
        for (var i = 0; i < pattern.length; i++) {
            _loop_1(i);
        }
        return buffer;
    };
    return WordGenerator;
}());
/**
 * 単純文字列生成を表すシンボル
 */
WordGenerator.simple_symbol = "simple";
/**
 * 母子音文字別定義単純文字列生成を表すシンボル
 */
WordGenerator.simplecv_symbol = "simplecv";
/**
 * 母子音文字別定義文字列生成を表示シンボル
 */
WordGenerator.chaincv_symbol = "chaincv";
//# sourceMappingURL=wgenerator.js.map