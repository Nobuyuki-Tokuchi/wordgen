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
    constructor(el, dict, equivalent) {
        this.el = el;
        this.data = {
            equivalent: equivalent,
            dictionary: dict,
            isSetEquivalentMode: false,
        };
        WMModules.equivalentDialog.onshow = () => {
            this.data.isSetEquivalentMode = (this.data.equivalent.selectedWordId === "");
        };
        WMModules.equivalentDialog.onhide = () => {
            this.data.equivalent.selectedValue = "";
            this.data.equivalent.selectedWordId = "";
        };
        this.initMethods();
    }
    /**
     * VMで使用するメソッドを定義するメソッド
     */
    initMethods() {
        this.methods = {
            /**
             * ダイアログで訳語を追加するためのメソッド
             */
            setTranslations: function _setTranslations(ev) {
                let files = ev.target.files;
                let name = "";
                for (let i = 0; i < files.length; i++) {
                    let reader = new FileReader();
                    reader.readAsText(files[i]);
                    this.equivalent.equivalentsList.data.splice(0);
                    reader.onload = () => {
                        let result = reader.result;
                        if (files[i].name.endsWith(".json")) {
                            let dict = JSON.parse(result);
                            name = name + ", " + dict.name;
                            for (let j = 0; j < dict.data.length; j++) {
                                this.equivalent.equivalentsList.data.push(dict.data[j]);
                            }
                        }
                        else {
                            let lines = result.replace('\r\n', '\n').replace('\r', '\n')
                                .split('\n').filter(function (el) {
                                return el !== "";
                            });
                            name = name + ", (unknown)";
                            for (let j = 0; j < lines.length; j++) {
                                this.equivalent.equivalentsList.data.push({ equivalents: lines[j].split(",").map(x => x.trim()), content: void 0 });
                            }
                        }
                    };
                }
                this.equivalent.equivalentsList.name = name;
            },
            /**
             * ダイアログで決定ボタンを押した場合の処理を行うメソッド
             */
            addTranslation: function _addTranslation() {
                if (this.equivalent.selectedValue !== "") {
                    let id = Number(this.equivalent.selectedWordId);
                    let word = this.dictionary.getWord(id);
                    word.insert(0, this.equivalent.selectedValue);
                }
            },
            /**
             * ダイアログでキャンセルボタンを押した場合の処理を行うメソッド
             */
            cancel: function _cancel() {
                WMModules.equivalentDialog.hide();
            },
        };
    }
}
//# sourceMappingURL=equivalentchoicevm.js.map