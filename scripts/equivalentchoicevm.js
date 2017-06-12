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
        this.initMethods();
    }
    initMethods() {
        this.methods = {
            addTranslation: function _addTranslation() {
                if (this.selectedValue !== "") {
                    let id = Number(document.getElementById("selectedWordId").value);
                    let word = this.dictionary.search(id);
                    word.insert(0, this.selectedValue);
                }
                this.selectedValue = "";
                this.dialog.hide();
            },
            cancel: function _cancel() {
                this.selectedValue = "";
                this.dialog.hide();
            },
        };
    }
}
//# sourceMappingURL=equivalentchoicevm.js.map