///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />
///<reference path="./ntdialog.ts" />

class EquivalentChoiceVM {
	el: string;
	data: EquivalentChoiceData;
	methods: {[key: string]: any};

	/**
	 * コンストラクタ
	 * @param el バインディングを適用するタグのid
	 * @param dict OTM形式辞書クラス
	 */
	constructor(el: string, dict: OtmDictionary, dialog: NtDialog) {
		this.el = el;
		this.data = <EquivalentChoiceData> {
			translations: WMModules.EQUIVALENTS,
			selectedValue: "",
			dictionary: dict,
			dialog: dialog,
		};

		this.initMethods();
	}

	private initMethods(): void {
		this.methods = {
			addTranslation: function _addTranslation() {
				if(this.selectedValue !== "") {
					let id = Number((<HTMLInputElement>document.getElementById("selectedWordId")).value);
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
