///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />

/**
 * 作成方法設定部で使用するViewModel
 */
class SettingVM {
	el: string;
	data: SettingData;
	methods: {[key: string]: any};
	computed: {[key: string]: any};

	/**
	 * コンストラクタ
	 * @param el バインディングを適用するタグのid
	 * @param createSetting 単語文字列作成に使用する設定
	 */
	constructor(el: string, createSetting: GeneratorSettings) {
		this.el = el;

		this.data = <SettingData> {
			generatorType: WMModules.GENERATOR_TYPE,
			createSetting: createSetting,
		};

		this.initMethods();
		this.initComputed();
	}

	/**
	 * VMで使用するメソッドを定義するメソッド
	 */
	private initMethods():void {
		this.methods = {
			/**
			 * 設定をインポートするためのメソッド
			 * @param ファイル読み込みイベント
			 */
			importSetting: function _importSetting(ev): void {
				let file = ev.target.files[0];
				let reader = new FileReader();
				reader.readAsText(file);
				reader.onload = () => {
					let result = reader.result;

					let setting;
					if(file.name.endsWith(".json")) {
						setting = SettingVM.setJsonSetting(result);
					}
					else {
						setting = SettingVM.setPlainSetting(result, this.createSetting);
					}

					this.createSetting.simple = setting.simple;
					this.createSetting.simplecv = setting.simplecv;
					this.createSetting.dependencycv = setting.dependencycv;
					this.createSetting.mode = setting.mode;
				}
			},

			/**
			 * 設定をインポートするためのメソッド
			 * @param クリックイベント
			 */
			exportSetting: function _exportSetting(ev): void {
				WMModules.exportJSON(this.createSetting, "setting.json");
			},

			/**
			 * 訳語ダイアログを開くためのメソッド
			 * @param クリックイベント
			 */
			showEquivalentDialog: function _showEquivalentDialog(ev): void {
				WMModules.equivalentDialog.show();
			}
		};
	}

	/**
	 * VMで使用するComputedを定義するメソッド
	 */
	private initComputed(): void {
		this.computed = {
			isSimple: function _isSimple(): boolean {
				return this.createSetting.mode === WordGenerator.SIMPLE_SYMBOL;
			},

			isSimpleCv: function _isSimpleCv(): boolean {
				return this.createSetting.mode === WordGenerator.SIMPLECV_SYMBOL;
			},

			isDependencyCv: function _isDependencyCv(): boolean {
				return this.createSetting.mode === WordGenerator.DEPENDENCYCV_SYMBOL;
			},
		}
	}

	/**
	 * JSON形式設定ファイルの設定を適用するための関数
	 * @param result 読み込んだファイルの内容
	 * @return 読み込んだファイルの内容を適用した設定
	 */
	private static setJsonSetting(result: string): GeneratorSettings {
		let setting = JSON.parse(result);

		if(setting === null || setting === undefined) {
			return null;
		}

		return <GeneratorSettings> {
			simple: setting.simple,
			simplecv: setting.simplecv,
			dependencycv: setting.dependencycv,
			mode: setting.mode,
		};
	}

	/**
	 * テキスト形式設定ファイルの設定を適用するための関数
	 * @param result 読み込んだファイルの内容
	 * @param createSetting 現在の設定
	 * @return 読み込んだファイルの内容を適用した設定
	 */
	private static setPlainSetting(result: string, createSetting: GeneratorSettings): GeneratorSettings {
		let lines = result.replace('\r\n', '\n').replace('\r', '\n')
			.split('\n').filter(function(el) {
				return el !== "" && !el.startsWith("#");
			});

		switch(createSetting.mode) {
			case WordGenerator.SIMPLE_SYMBOL:
				createSetting.simple.letters = SettingVM.getPlainSimpleWGSetting(lines);
				break;
			case WordGenerator.SIMPLECV_SYMBOL:
				createSetting.simplecv = SettingVM.getPlainSimpleCvWGSetting(lines);
				break;
			case WordGenerator.DEPENDENCYCV_SYMBOL:
				createSetting.dependencycv = SettingVM.getPlainDependencyCvWGSetting(lines);
				break;
			default:
				break;
		}

		return createSetting;
	}

	/**
	 * テキスト形式SimpleWordGenerator設定ファイルの設定を適用するための関数
	 * @param lines 読み込んだファイルの内容
	 * @param createSetting 現在の設定
	 * @return 使用する文字の一覧
	 */
	private static getPlainSimpleWGSetting(lines: string[]): string {
		let letters = [];
		for(let i = 0; i < lines.length; i++) {
			letters = letters.concat(lines[i].split(","));
		}

		return letters.join(",");
	}

	/**
	 * テキスト形式SimpleCVWordGenerator設定ファイルの設定を適用するための関数
	 * @param lines 読み込んだファイルの内容
	 * @return 読み込んだファイルの内容を適用した設定
	 */
	private static getPlainSimpleCvWGSetting(lines: string[]): SimpleCvWGSetting {
		let consonants = "";
		let vowels = "";
		let patterns = "";
		let prohibitions = "";

		for(let i = 0; i < lines.length; i++) {
			let split = lines[i].split(/\s*=\s*/);
			switch(split[0].trim()) {
				case "consonants":
					consonants = split[1];
					break;
				case "vowels":
					vowels = split[1];
					break;
				case "patterns":
					patterns = split[1];
					break;
				case "prohibitions":
					prohibitions = split[1];
					break;
			}
		}

		return <SimpleCvWGSetting> {
			consonants: consonants,
			vowels: vowels,
			patterns: patterns,
			prohibitions: prohibitions,
		};
	}

	/**
	 * テキスト形式のDependencyCvWordGenerator設定ファイルの設定を適用するための関数
	 * @param lines 読み込んだファイルの内容
	 * @return 読み込んだファイルの内容を適用した設定
	 */
	private static getPlainDependencyCvWGSetting(lines: string[]): DependencyCvWGSetting {
		let consonants = "";
		let vowels = "";
		let patterns = "";
		let prohibitions = "";
		let transitions = [];

		for(let i = 0; i < lines.length; i++) {
			let split = lines[i].split(/\s*=\s*/);
			switch(split[0].trim()) {
				case "consonants":
					consonants = split[1];
					break;
				case "vowels":
					vowels = split[1];
					break;
				case "patterns":
					patterns = split[1];
					break;
				case "prohibitions":
					prohibitions = split[1];
				default:
					if(consonants.indexOf(split[0]) !== 0 || vowels.indexOf(split[0]) !== 0) {
						transitions.push(<DependencyCvTransition> {
							letter: split[0],
							nextLetters: split[1]
						});
					}
					break;
			}
		}

		return <DependencyCvWGSetting> {
			consonants: consonants,
			vowels: vowels,
			patterns: patterns,
			transitions: transitions,
			prohibitions: prohibitions,
		};
	}
}

