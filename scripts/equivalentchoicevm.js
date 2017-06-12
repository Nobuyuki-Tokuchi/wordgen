///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />
///<reference path="./ntdialog.ts" />
class EquivalentChoiceVM {
    /**
     * コンストラクタ
     * @param el バインディングを適用するタグのid
     * @param dict OTM形式辞書クラス
     */
    constructor(el, dict, dialog) {
        this.el = el;
        this.data = {
            translations: WMModules.EQUIVALENTS,
            selectedValue: "",
            dictionary: dict,
            dialog: dialog,
        };
        this.data.dialog.onhide = () => {
            this.data.selectedValue = "";
        };
        this.initMethods();
    }
    /**
     * VMで使用するメソッドを定義するメソッド
     */
    initMethods() {
        this.methods = {
            /**
             * ダイアログで決定ボタンを押した場合の処理を行うメソッド
             */
            addTranslation: function _addTranslation() {
                if (this.selectedValue !== "") {
                    let id = Number(document.getElementById("selectedWordId").value);
                    let word = this.dictionary.getWord(id);
                    word.insert(0, this.selectedValue);
                }
                this.dialog.hide();
            },
            /**
             * ダイアログでキャンセルボタンを押した場合の処理を行うメソッド
             */
            cancel: function _cancel() {
                this.dialog.hide();
            },
        };
    }
}
//# sourceMappingURL=equivalentchoicevm.js.map