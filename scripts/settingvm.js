///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />
/**
 * 作成方法設定部で使用するViewModel
 */
class SettingVM {
    /**
     * コンストラクタ
     * @param el バインディングを適用するタグのid
     * @param createSetting 単語文字列作成に使用する設定
     */
    constructor(el, createSetting) {
        this.el = el;
        this.data = {
            generatorType: WMModules.GENERATOR_TYPE,
            createSetting: createSetting,
        };
        this.initMethods();
        this.initComputed();
    }
    /**
     * VMで使用するメソッドを定義するメソッド
     */
    initMethods() {
        this.methods = {
            /**
             * 設定をインポートするためのメソッド
             * @param ファイル読み込みイベント
             */
            importSetting: function _importSetting(ev) {
                let file = ev.target.files[0];
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    let result = reader.result;
                    let setting;
                    if (file.name.endsWith(".json")) {
                        setting = SettingVM.setJsonSetting(result);
                    }
                    else {
                        setting = SettingVM.setPlainSetting(result, this.createSetting);
                    }
                    this.createSetting.simple = setting.simple;
                    this.createSetting.simplecv = setting.simplecv;
                    this.createSetting.dependencycv = setting.dependencycv;
                    this.createSetting.mode = setting.mode;
                };
            },
            /**
             * 設定をインポートするためのメソッド
             * @param クリックイベント
             */
            exportSetting: function _exportSetting(ev) {
                WMModules.exportJSON(this.createSetting, "setting.json");
            },
            /**
             * 訳語ダイアログを開くためのメソッド
             * @param クリックイベント
             */
            showEquivalentDialog: function _showEquivalentDialog(ev) {
                WMModules.equivalentDialog.show();
            }
        };
    }
    /**
     * VMで使用するComputedを定義するメソッド
     */
    initComputed() {
        this.computed = {
            isSimple: function _isSimple() {
                return this.createSetting.mode === WordGenerator.SIMPLE_SYMBOL;
            },
            isSimpleCv: function _isSimpleCv() {
                return this.createSetting.mode === WordGenerator.SIMPLECV_SYMBOL;
            },
            isDependencyCv: function _isDependencyCv() {
                return this.createSetting.mode === WordGenerator.DEPENDENCYCV_SYMBOL;
            },
        };
    }
    /**
     * JSON形式設定ファイルの設定を適用するための関数
     * @param result 読み込んだファイルの内容
     * @return 読み込んだファイルの内容を適用した設定
     */
    static setJsonSetting(result) {
        let setting = JSON.parse(result);
        if (setting === null || setting === undefined) {
            return null;
        }
        return {
            simple: setting.simple,
            simplecv: setting.simplecv,
            dependencycv: setting.dependencycv,
            mode: setting.mode,
        };
    }
    /**
     * テキスト形式設定ファイルの設定を適用するための関数
     * @param result 読み込んだファイルの内容
     * @param createSetting 現在の設定
     * @return 読み込んだファイルの内容を適用した設定
     */
    static setPlainSetting(result, createSetting) {
        let lines = result.replace('\r\n', '\n').replace('\r', '\n')
            .split('\n').filter(function (el) {
            return el !== "" && !el.startsWith("#");
        });
        switch (createSetting.mode) {
            case WordGenerator.SIMPLE_SYMBOL:
                createSetting.simple.letters = SettingVM.getPlainSimpleWGSetting(lines);
                break;
            case WordGenerator.SIMPLECV_SYMBOL:
                createSetting.simplecv = SettingVM.getPlainSimpleCvWGSetting(lines);
                break;
            case WordGenerator.DEPENDENCYCV_SYMBOL:
                createSetting.dependencycv = SettingVM.getPlainDependencyCvWGSetting(lines);
                break;
            default:
                break;
        }
        return createSetting;
    }
    /**
     * テキスト形式SimpleWordGenerator設定ファイルの設定を適用するための関数
     * @param lines 読み込んだファイルの内容
     * @param createSetting 現在の設定
     * @return 使用する文字の一覧
     */
    static getPlainSimpleWGSetting(lines) {
        let letters = [];
        for (let i = 0; i < lines.length; i++) {
            letters = letters.concat(lines[i].split(","));
        }
        return letters.join(",");
    }
    /**
     * テキスト形式SimpleCVWordGenerator設定ファイルの設定を適用するための関数
     * @param lines 読み込んだファイルの内容
     * @return 読み込んだファイルの内容を適用した設定
     */
    static getPlainSimpleCvWGSetting(lines) {
        let consonants = "";
        let vowels = "";
        let patterns = "";
        let prohibitions = "";
        for (let i = 0; i < lines.length; i++) {
            let split = lines[i].split(/\s*=\s*/);
            switch (split[0].trim()) {
                case "consonants":
                    consonants = split[1];
                    break;
                case "vowels":
                    vowels = split[1];
                    break;
                case "patterns":
                    patterns = split[1];
                    break;
                case "prohibitions":
                    prohibitions = split[1];
                    break;
            }
        }
        return {
            consonants: consonants,
            vowels: vowels,
            patterns: patterns,
            prohibitions: prohibitions,
        };
    }
    /**
     * テキスト形式のDependencyCvWordGenerator設定ファイルの設定を適用するための関数
     * @param lines 読み込んだファイルの内容
     * @return 読み込んだファイルの内容を適用した設定
     */
    static getPlainDependencyCvWGSetting(lines) {
        let consonants = "";
        let vowels = "";
        let patterns = "";
        let prohibitions = "";
        let transitions = [];
        for (let i = 0; i < lines.length; i++) {
            let split = lines[i].split(/\s*=\s*/);
            switch (split[0].trim()) {
                case "consonants":
                    consonants = split[1];
                    break;
                case "vowels":
                    vowels = split[1];
                    break;
                case "patterns":
                    patterns = split[1];
                    break;
                case "prohibitions":
                    prohibitions = split[1];
                default:
                    if (consonants.indexOf(split[0]) !== 0 || vowels.indexOf(split[0]) !== 0) {
                        transitions.push({
                            letter: split[0],
                            nextLetters: split[1]
                        });
                    }
                    break;
            }
        }
        return {
            consonants: consonants,
            vowels: vowels,
            patterns: patterns,
            transitions: transitions,
            prohibitions: prohibitions,
        };
    }
}
//# sourceMappingURL=settingvm.js.map