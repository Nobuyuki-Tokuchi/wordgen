///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />
///<reference path="./ntdialog.ts" />
/**
 * 単語作成部で使用するViewModel
 */
class WordDisplayVM {
    /**
     * コンストラクタ
     * @param el バインディングを適用するタグのid
     * @param dict OTM形式辞書クラス
     * @param createSetting 単語文字列作成に使用する設定
     */
    constructor(el, dict, createSetting, equivalent) {
        this.el = el;
        this.data = {
            dictionary: dict,
            isDisabled: false,
            createSetting: createSetting,
            id: 1,
            equivalent: equivalent,
        };
        this.initMethods();
    }
    /**
     * VMで使用するメソッドを定義するメソッド
     */
    initMethods() {
        this.methods = {
            /**
             * 単語文字列を作成するメソッド
             */
            create: function _create() {
                let form = "";
                switch (this.createSetting.mode) {
                    case WordGenerator.SIMPLE_SYMBOL:
                        form = WordGenerator.simple(this.createSetting.simple);
                        break;
                    case WordGenerator.SIMPLECV_SYMBOL:
                        form = WordGenerator.simplecv(this.createSetting.simplecv);
                        break;
                    case WordGenerator.DEPENDENCYCV_SYMBOL:
                        form = WordGenerator.dependencycv(this.createSetting.dependencycv);
                        break;
                    default:
                        break;
                }
                let word = new OtmWord(this.id++, form);
                word.add("");
                this.dictionary.add(word);
            },
            /**
             * 設定されている全ての訳語に対して単語を作成するメソッド
             */
            createAll: function _createAll() {
                this.equivalent.equivalentsList.data.forEach((x) => {
                    let form = "";
                    switch (this.createSetting.mode) {
                        case WordGenerator.SIMPLE_SYMBOL:
                            form = WordGenerator.simple(this.createSetting.simple);
                            break;
                        case WordGenerator.SIMPLECV_SYMBOL:
                            form = WordGenerator.simplecv(this.createSetting.simplecv);
                            break;
                        case WordGenerator.DEPENDENCYCV_SYMBOL:
                            form = WordGenerator.dependencycv(this.createSetting.dependencycv);
                            break;
                        default:
                            break;
                    }
                    let word = new OtmWord(this.id++, form);
                    word.add(x.equivalents.join(","));
                    this.dictionary.add(word);
                });
            },
            /**
             * 作成した全ての単語を削除するメソッド
             */
            removeAll: function _removeAll() {
                this.dictionary.removeAll();
                // idを初期値にする
                this.id = 1;
            },
            /**
             * 作成した単語一覧をOTM-JSON形式で出力するメソッド
             */
            outputOtmJSON: function _outputOtmJSON() {
                // idを振り直す
                let id = 1;
                this.dictionary.words.forEach((x) => {
                    x.entry.id = id++;
                });
                WMModules.exportJSON(this.dictionary, "dict.json");
                // 引き続き作成する場合を考えてidを更新する
                this.id = id;
            },
            // 個々で使用する部分
            /**
             * 訳語選択ダイアログを呼び出すメソッド
             * @param 訳語を設定する単語クラス
             */
            showEquivalentDialog: function _showEquivalentDialog(word) {
                this.equivalent.selectedWordId = word.entry.id.toString();
                WMModules.equivalentDialog.show();
            },
            /**
             * 単語を削除するメソッド
             * @param 削除する単語クラス
             */
            remove: function _remove(word) {
                this.dictionary.remove(word.entry.id);
            },
            /**
             * 単語の区切りの","で文字列を区切って配列にするためのメソッド
             * @param 単語の訳語(カンマ区切り)
             * @return カンマを区切り文字として分割した結果の文字列配列
             */
            splitter: function _splitter(value) {
                return value.split(",").map(function (x) { return x.trim(); });
            },
        };
    }
}
//# sourceMappingURL=worddisplayvm.js.map