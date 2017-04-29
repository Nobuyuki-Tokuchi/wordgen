var WordGenerator = (function () {
    function WordGenerator() {
    }
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
    WordGenerator.simplecv = function (setting) {
        var consonants = setting.consonants.split(",");
        var vowels = setting.vowels.split(",");
        var letters = consonants.concat(vowels);
        var buffer = "";
        var patternList = setting.patterns.split(",");
        var pattern = patternList[Math.floor(Math.random() * patternList.length)];
        for (var i = 0; i < pattern.length; i++) {
            switch (pattern[i]) {
                case "C":
                case "c":
                    buffer += consonants[Math.floor(Math.random() * consonants.length)];
                    break;
                case "V":
                case "v":
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
    return WordGenerator;
}());
WordGenerator.simple_symbol = "simple";
WordGenerator.simplecv_symbol = "simplecv";
//# sourceMappingURL=wgenerator.js.map