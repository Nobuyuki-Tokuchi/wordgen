/**
 * OTM形式単語情報クラス
 */
class OtmWord {
	entry: OtmWordEntry;
	translations: OtmWordTranslation[];
	tags: string[];
	contents: any[];
	variations: any[];
	relations: any[];

	constructor(id: number, form: string) {
		this.entry = new OtmWordEntry(id, form);
		this.translations = [];
		this.tags = [];
		this.contents = [];
		this.variations = [];
		this.relations = [];
		this.translations.push(new OtmWordTranslation("", []));
	}
}

/**
 * OTM形式単語文字列クラス
 */
class OtmWordEntry {
	id: number;
	form: string;

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

	constructor(title: string, forms: string[]) {
		this.title = title;
		this.forms = forms;
	}
}
