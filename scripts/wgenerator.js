var WordGenerator = (function () {
    function WordGenerator() {
    }
    WordGenerator.simple = function (setting) {
        var letters = setting.letters.split(",");
        var buffer = "";
        var count = typeof setting.input === "number" ?
            setting.input : parseInt(setting.input);
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
        for (var i = 0; i < setting.input.length; i++) {
            switch (setting.input[i]) {
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