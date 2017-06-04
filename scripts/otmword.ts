/*
 * 汎用的に作成しているが
 * Vue.js対策しているため多少冗長な部分もあり．
 */

/**
 * OTM形式辞書クラス
 */
class OtmDictionary {
	/**
	 * 単語情報を保持する配列
	 */
	words: OtmWord[];

	/**
	 * ZpDIC用の設定
	 */
	zpdic: ZpDicSettings;

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
	add(word: OtmWord): void {
		this.words.push(word);
	}

	/**
	 * この辞書に渡された単語情報を削除する．
	 * 削除する単語かどうかはIdによって比較される．
	 * @param param 単語情報を持つOtmWordクラスまたはIDを表す数値
	 */
	remove(param: OtmWord | number): void {
		let index;
		if(param instanceof OtmWord) {
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

	/**
	 * この辞書に登録されている単語情報を全て削除する．
	 */
	removeAll(): void {
		this.words.splice(0, this.words.length);
	}
}

/**
 * OTM形式単語情報クラス
 */
class OtmWord {
	/**
	 * 単語
	 */
	entry: OtmWordEntry;

	/**
	 * 訳語情報
	 */
	translations: OtmWordTranslation[];

	/**
	 * タグ
	 */
	tags: string[];

	/**
	 * コンテンツ
	 */
	contents: any[];

	/**
	 */
	variations: any[];

	/**
	 * 関連語
	 */
	relations: any[];

	/**
	 * コンストラクタ
	 * @param id 単語のID
	 * @param form 単語
	 */
	constructor(id: number, form: string) {
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
	add(translations: OtmWordTranslation | string): void {
		if(translations instanceof OtmWordTranslation) {
			this.translations.push(translations);
		}
		else {
			this.translations.push(new OtmWordTranslation("", [ translations ]));
		}
	}

	/**
	 * この単語情報に渡された訳語情報を削除する
	 * @param param 訳語情報またはインデックス
	 */
	remove(param: OtmWordTranslation | number): void {
		let index;
		if(param instanceof OtmWordTranslation) {
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
	id: number;
	form: string;

	/**
	 * コンストラクタ
	 * @param id 単語のID
	 * @param form 単語
	 */
	constructor(id: number, form: string) {
		this.id = id;
		this.form = form;
	}
}

/**
 * OTM形式単語訳語クラス
 */
class OtmWordTranslation {
	title: string;
	forms: string[];

	/**
	 * コンストラクタ
	 * @param title: 単語の品詞など
	 * @param forms: 訳語一覧
	 */
	constructor(title: string, forms?: string[]) {
		this.title = title;
		this.forms = forms || [];
	}

	/**
	 * この訳語情報に渡された訳語を追加する．
	 * @param 訳語
	 */
	add(translation: string): void {
		this.forms.push(translation);
	}

	/**
	 * この訳語情報に渡された訳語を削除する．
	 * @param 訳語またはインデックス
	 */
	remove(param: string | number): void {
		let index;
		if(typeof param === "string") {
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
	removeAll(): void {
		this.forms.splice(0, this.forms.length);
	}
}

/**
 * ZpDicの設定項目を保持するクラス
 */
class ZpDicSettings {
	/**
	 * 文字の順番
	 */
	alphabetOrder: string;

	/**
	 * デフォルトでの文字の順番
	 */
	static DEFAULT_ALPHABET_ORDER = "abcdefghijklmnopqrstuvwxyz";

	/**
	 * コンストラクタ
	 */
	constructor() {
		this.alphabetOrder = ZpDicSettings.DEFAULT_ALPHABET_ORDER;
	}
}

