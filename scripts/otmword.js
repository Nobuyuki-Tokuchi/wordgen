/**
 * OTM形式単語情報クラス
 */
var OtmWord = (function () {
    function OtmWord(id, form) {
        this.entry = new OtmWordEntry(id, form);
        this.translations = [];
        this.tags = [];
        this.contents = [];
        this.variations = [];
        this.relations = [];
        this.translations.push(new OtmWordTranslation("", []));
    }
    return OtmWord;
}());
/**
 * OTM形式単語文字列クラス
 */
var OtmWordEntry = (function () {
    function OtmWordEntry(id, form) {
        this.id = id;
        this.form = form;
    }
    return OtmWordEntry;
}());
/**
 * OTM形式単語訳語クラス
 */
var OtmWordTranslation = (function () {
    function OtmWordTranslation(title, forms) {
        this.title = title;
        this.forms = forms;
    }
    return OtmWordTranslation;
}());
//# sourceMappingURL=otmword.js.map