/*
 * 汎用的に作成しているが
 * Vue.js対策しているため多少冗長な部分もあり．
 */
/**
 * OTM形式辞書クラス
 */
class OtmDictionary {
    /**
     * コンストラクタ
     */
    constructor() {
        this.words = [];
        this.zpdic = new ZpDicSettings();
    }
    /**
     * この辞書に渡された単語情報を追加する．
     * @param word 単語情報を持つOtmWordクラス
     */
    add(word) {
        this.words.push(word);
    }
    /**
     * この辞書に渡された単語情報を削除する．
     * 削除する単語かどうかはIdによって比較される．
     * @param param 単語情報を持つOtmWordクラスまたはIDを表す数値
     */
    remove(param) {
        let index;
        if (param instanceof OtmWord) {
            index = this.words.findIndex((element) => {
                return element.entry.id === param.entry.id;
            });
        }
        else {
            index = this.words.findIndex((element) => {
                return element.entry.id === param;
            });
        }
        this.words.splice(index, 1);
    }
    search(param) {
        let index;
        if (param instanceof OtmWord) {
            index = this.words.findIndex((element) => {
                return element.entry.id === param.entry.id;
            });
        }
        else {
            index = this.words.findIndex((element) => {
                return element.entry.id === param;
            });
        }
        return this.words[index];
    }
    /**
     * この辞書に登録されている単語情報を全て削除する．
     */
    removeAll() {
        this.words.splice(0, this.words.length);
    }
}
/**
 * OTM形式単語情報クラス
 */
class OtmWord {
    /**
     * コンストラクタ
     * @param id 単語のID
     * @param form 単語
     */
    constructor(id, form) {
        this.entry = new OtmWordEntry(id, form);
        this.translations = [];
        this.tags = [];
        this.contents = [];
        this.variations = [];
        this.relations = [];
    }
    /**
     * この単語情報に渡された訳語情報を追加する
     * @param translations 訳語情報または訳語
     */
    add(translations) {
        if (this.translations.length > 0 && this.translations.every((x) => x.forms.length > 0 && x.forms.every((y) => y == null || y === ""))) {
            this.translations.splice(0, this.translations.length);
        }
        if (translations instanceof OtmWordTranslation) {
            this.translations.push(translations);
        }
        else {
            this.translations.push(new OtmWordTranslation("", [translations]));
        }
    }
    insert(index, translations) {
        if (index >= this.translations.length) {
            this.translations.push(new OtmWordTranslation("", translations.split(",").map(function (x) { return x.trim(); })));
        }
        else if (index < 0) {
            this.translations.unshift(new OtmWordTranslation("", translations.split(",").map(function (x) { return x.trim(); })));
        }
        else {
            if (this.translations[index].forms.length === 0 ||
                (this.translations[index].forms.length > 0 &&
                    (this.translations[index].forms[0] == null || this.translations[index].forms[0] === ""))) {
                this.translations[index].forms.splice(0, 1);
            }
            translations.split(",").map(function (x) { return x.trim(); }).forEach((x) => {
                this.translations[index].forms.push(x);
            });
        }
    }
    /**
     * この単語情報に渡された訳語情報を削除する
     * @param param 訳語情報またはインデックス
     */
    remove(param) {
        let index;
        if (param instanceof OtmWordTranslation) {
            index = this.translations.findIndex((element) => {
                return element === param;
            });
        }
        else {
            index = param;
        }
        this.translations.splice(index, 1);
    }
}
/**
 * OTM形式単語文字列クラス
 */
class OtmWordEntry {
    /**
     * コンストラクタ
     * @param id 単語のID
     * @param form 単語
     */
    constructor(id, form) {
        this.id = id;
        this.form = form;
    }
}
/**
 * OTM形式単語訳語クラス
 */
class OtmWordTranslation {
    /**
     * コンストラクタ
     * @param title: 単語の品詞など
     * @param forms: 訳語一覧
     */
    constructor(title, forms) {
        this.title = title;
        this.forms = forms || [];
    }
    /**
     * この訳語情報に渡された訳語を追加する．
     * @param 訳語
     */
    add(translation) {
        this.forms.push(translation);
    }
    /**
     * この訳語情報に渡された訳語を削除する．
     * @param 訳語またはインデックス
     */
    remove(param) {
        let index;
        if (typeof param === "string") {
            index = this.forms.findIndex((element) => {
                return element === param;
            });
        }
        else {
            index = param;
        }
        this.forms.splice(index, 1);
    }
    /**
     * この訳語情報の訳語を全て削除する．
     */
    removeAll() {
        this.forms.splice(0, this.forms.length);
    }
}
/**
 * ZpDicの設定項目を保持するクラス
 */
class ZpDicSettings {
    /**
     * コンストラクタ
     */
    constructor() {
        this.alphabetOrder = ZpDicSettings.DEFAULT_ALPHABET_ORDER;
    }
}
/**
 * デフォルトでの文字の順番
 */
ZpDicSettings.DEFAULT_ALPHABET_ORDER = "abcdefghijklmnopqrstuvwxyz";
//# sourceMappingURL=otmword.js.map