///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />

class SettingData {
	generatorType: [{ text: string, value: string }];
	createSetting: GeneratorSettings;
}

class SettingVM {
	el: string;
	data: SettingData;
	methods: {[key: string]: any};
	computed: {[key: string]: any};

	constructor(el: string, createSetting: GeneratorSettings) {
		this.el = el;

		this.data = <SettingData> {
			generatorType: WMModules.GENERATOR_TYPE,
			createSetting: createSetting,
		};

		this.initMethods();
		this.initComputed();
	}

	initMethods() {
		this.methods = {
			importSetting: function _importSetting(ev): void {
				let file = ev.target.files[0];
				let reader = new FileReader();
				reader.readAsText(file);
				reader.onload = () => {
					let result = reader.result;

					if(file.name.endsWith(".json")) {
						SettingVM.setJsonSetting(result, this.createSetting);
					}
					else {
						SettingVM.setPlainSetting(result, this.createSetting);
					}
				}
			},
			exportSetting: function _exportSetting(ev): void {
				WMModules.exportJSON(this.createSetting, "setting.json");
			},
		};
	}

	initComputed() {
		this.computed = {
			isSimple: function _isSimple(): boolean {
				return this.createSetting.mode === WordGenerator.SIMPLE_SYMBOL;
			},

			isSimpleCv: function _isSimpleCv(): boolean {
				return this.createSetting.mode === WordGenerator.SIMPLECV_SYMBOL;
			},

			isChainCv: function _isChainCv(): boolean {
				return this.createSetting.mode === WordGenerator.CHAINCV_SYMBOL;
			},
		}
	}

	/**
	 * JSON形式設定ファイルの設定を適用するための関数
	 * @param result 読み込んだファイルの内容
	 */
	private static setJsonSetting(result: string, createSetting: GeneratorSettings): void {
		let setting = JSON.parse(result);

		if(setting === null || setting === undefined) {
			return null;
		}

		createSetting.simple = setting.simple;
		createSetting.simplecv = setting.simplecv;
		createSetting.chaincv = setting.chaincv;
		createSetting.mode = setting.mode || createSetting.mode;
	}

	/**
	 * テキスト形式設定ファイルの設定を適用するための関数
	 * @param result 読み込んだファイルの内容
	 */
	private static setPlainSetting(result: string, createSetting: GeneratorSettings): void {
	}
}

