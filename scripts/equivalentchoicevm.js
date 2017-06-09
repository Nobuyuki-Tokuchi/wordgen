///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />
///<reference path="./ntdialog.ts" />
class EquivalentChoiceVM {
    constructor(el, dict) {
        this.el = el;
        this.data = {
            translations: WMModules.EQUIVALENTS,
            selectedValue: "",
            dictionary: dict,
        };
        this.initMethods();
    }
    initMethods() {
        this.methods = {
            addTranslation: function _addTranslation() {
                if (this.selectedValue == null || this.selectedValue !== "") {
                }
            },
            cancel: function _cancel() {
            },
        };
    }
}
//# sourceMappingURL=equivalentchoicevm.js.map