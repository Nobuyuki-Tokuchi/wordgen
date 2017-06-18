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
	constructor(el: string, dict: OtmDictionary) {
		this.el = el;
		this.data = <EquivalentChoiceData> {
			translations: WMModules.defaultEquivalents(),
			selectedValue: "",
			dictionary: dict,
			selectedWordId: "",
			isSetEquivalentMode: false,
		};

		WMModules.equivalentDialog.onshow = () => {
			this.data.selectedWordId = (<HTMLInputElement>document.getElementById("selectedWordId")).value;
			this.data.isSetEquivalentMode = (this.data.selectedWordId === "");
		}

		WMModules.equivalentDialog.onhide = () => {
			this.data.selectedValue = "";
			this.data.selectedWordId = "";
		}

		this.initMethods();
	}

	/**
	 * VMで使用するメソッドを定義するメソッド
	 */
	private initMethods(): void {
		this.methods = {

			/**
			 * ダイアログで訳語を追加するためのメソッド
			 */
			setTranslations: function _setTranslations(ev): void {
				let files = ev.target.files;

				for(let i = 0; i < files.length; i++){
					let reader = new FileReader();
					reader.readAsText(files[i]);
					
					this.translations.splice(0);
					reader.onload = () => {
						let result = reader.result;

						let lines = result.replace('\r\n', '\n').replace('\r', '\n')
							.split('\n').filter(function(el) {
								return el !== "";
						});

						for(let i = 0; i < lines.length; i++) {
							this.translations.push(lines[i]);
						}
					};
				}
			},

			/**
			 * ダイアログで決定ボタンを押した場合の処理を行うメソッド
			 */
			addTranslation: function _addTranslation(): void {
				if(this.selectedValue !== "") {
					let id = Number(this.selectedWordId);
					let word = this.dictionary.getWord(id);

					word.insert(0, this.selectedValue);
				}
			},

			/**
			 * ダイアログでキャンセルボタンを押した場合の処理を行うメソッド
			 */
			cancel: function _cancel(): void {
				WMModules.equivalentDialog.hide();
			},
		};
	}
}
