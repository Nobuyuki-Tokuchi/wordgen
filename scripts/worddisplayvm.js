///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />
/**
 * WordDisplayの持つdataのインターフェイス
 */
class WordDisplayData {
}
class WordDisplayVM {
    /**
     * コンストラクタ
     * @param el バインディングを適用するタグのid
     * @param dict OTM形式辞書クラス
     * @param createSetting 単語文字列作成に使用する設定
     */
    constructor(el, dict, createSetting) {
        this.el = el;
        this.data = {
            dictionary: dict,
            isDisabled: false,
            createSetting: createSetting,
            id: 1,
        };
        this.initMethods();
    }
    /**
     * VMで使用するメソッドを定義するメソッド
     */
    initMethods() {
        this.methods = {
            create: function _create() {
                let form = "";
                switch (this.createSetting.mode) {
                    case WordGenerator.SIMPLE_SYMBOL:
                        form = WordGenerator.simple(this.createSetting.simple);
                        break;
                    case WordGenerator.SIMPLECV_SYMBOL:
                        form = WordGenerator.simplecv(this.createSetting.simplecv);
                        break;
                    case WordGenerator.CHAINCV_SYMBOL:
                        form = WordGenerator.chaincv(this.createSetting.chaincv);
                        break;
                    default:
                        break;
                }
                let word = new OtmWord(this.id++, form);
                word.add("");
                this.dictionary.add(word);
            },
            removeAll: function _removeAll() {
                this.dictionary.removeAll();
                // idを初期値にする
                this.id = 1;
            },
            outputOtmJSON: function _outputOtmJSON() {
                // idを振り直す
                let id = 1;
                this.dictionary.words.forEach((x) => { x.entry.id = id++; });
                WMModules.exportJSON(this.dictionary, "dict.json");
                // 引き続き作成する場合を考えてidを更新する
                this.id = id;
            },
            // 個々で使用する部分
            setEquivalent: function _setEquivalents(word) {
            },
            remove: function _remove(word) {
                this.dictionary.remove(word.entry.id);
            },
            splitter: function _splitter(value) {
                return value.split(",").map(function (x) { return x.trim(); });
            },
        };
    }
}
//# sourceMappingURL=worddisplayvm.js.map