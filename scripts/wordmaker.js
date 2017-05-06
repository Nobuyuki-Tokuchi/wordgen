var buttons;
var wordDisplay;
var settings;
var dialog;

(function () {
	// 画面ロード時に初期化処理を呼び出す
	window.addEventListener('load', function _initEvent() {
		init();
		window.removeEventListener('load', _initEvent);
	});

	let constant = {
		options: [
			{ text: '単純文字列生成', value: WordGenerator.simple_symbol },
			{ text: '母子音別定義単純文字列生成', value: WordGenerator.simplecv_symbol },
			//{ text: '多定義文字列生成', value: WordGenerator.manytype_symbol },
		],
	}

	let data = {
		createSettings: {
			setSimple: {
				letters: "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,r,s,t,u,v,w,x,y,z",
				patterns: "5",
			},
			setSimpleCv: {
				consonants: "b,c,d,f,g,h,j,k,l,m,n,p,r,s,t,v,w,x,z",
				vowels: "a,e,i,o,u,y",
				patterns: "CVCCV",
			}
		},
		dict: {
			words: [
			],
			zpdic: {
				alphabetOrder: "abcdefghijklmnopqrstuvwxyz"
			},
		}
	};

	// 初期化用関数
	function init() {
		// 詳細設定ダイアログの初期化
		dialog = new NtDialog("詳細設定", {
			top: 100, left:500,
			width: 500, height: 200,
			style: 'flat',
			draggable: true,
			dialog: document.getElementById('dialogs'),
		});

		// 生成文字列一覧のVMの初期化
		wordDisplay = new Vue({
			el: '#wordDisplay',
			data: {
				words: data.dict.words,
			},
			methods: {
				showDialog: function _showDialog() {
					dialog.show();
				},
				create: function _create() {
					let form = "";
					switch(settings.mode.value) {
						case WordGenerator.simple_symbol:
							form = WordGenerator.simple(data.createSettings.setSimple);
							break;
						case WordGenerator.simplecv_symbol:
							form = WordGenerator.simplecv(data.createSettings.setSimpleCv);
							break;
						default:
							break;
					}
					this.words.push(new OtmWord(0, form));
				},
				outputOtmJson: function _outputOtmJson() {
					let id = 1;
					this.words.forEach(function(x) { x.entry.id = id++; });

					exportJson(data.dict, "data.json");
				},
				remove: function _remove(index) {
					this.words.splice(index, 1);
				},
				removeAll: function _removeAll() {
					this.words.splice(0, this.words.length);
				}
			},
		});

		// 設定部分のVMの初期化
		settings = new Vue({
			el: '#settings',
			data: {
				mode: {
					value: 'simple',
					options: constant.options,
				},
				createSettings: data.createSettings,
			},
			computed: {
				isSimple: function _isSimple() {
					return this.mode.value === WordGenerator.simple_symbol;
				},
				isSimpleCv: function _isSimpleCv() {
					return this.mode.value === WordGenerator.simplecv_symbol;
				},
			},
			methods: {
				importSetting: function _importSetting(ev) {
					let file = ev.target.files[0];
					let reader = new FileReader();
					reader.readAsText(file);

					let this_ = this;
					reader.onload = function _reader_onload(loadEv) {
						let result = reader.result;

						if(file.name.endsWith(".json")) {
							let mode = setJsonSettings(result);
							this_.mode.value = mode || this_.mode.value;
						}
						else {
							setPlainSettings(this_.mode.value, result);
						}
					}
				},
				exportSetting: function _exportSetting(ev) {
					let exportData = {
						mode: this.mode.value,
						setSimple: this.createSettings.setSimple,
						setSimpleCv: this.createSettings.setSimpleCv,
					};

					exportJson(exportData, "setting.json");
				},
			}
		});
	}

	/**
	 * JSON形式設定ファイルの設定を適用するための関数
	 * @param mode 適用するモード
	 * @return result 読み込んだファイルの内容
	 */
	function setJsonSettings(result) {
		let settings = JSON.parse(result);

		if(settings === null || settings === undefined) {
			return null;
		}

		data.createSettings.setSimple = settings.setSimple;
		data.createSettings.setSimpleCv = settings.setSimpleCv;

		return settings.mode;
	}

	/**
	 * テキスト形式設定ファイルの設定を適用するための関数
	 * @param mode 適用するモード
	 * @param result 読み込んだファイルの内容
	 */
	function setPlainSettings(mode, result) {
		let arr = result.replace('\r\n', '\n').replace('\r', '\n')
			.split('\n').filter(function(el) {
				return el !== "" && !el.startsWith("#");
			});

		switch(mode) {
			case WordGenerator.simple_symbol:
				let letters = [];
				for(let i = 0; i < arr.length; i++) {
					letters = letters.concat(arr[i].split(","));
				}

				data.createSettings.setSimple.letters = letters.join(",");
				break;
			case WordGenerator.simplecv_symbol:
				let consonants = "";
				let vowels = "";

				for(let i = 0; i < arr.length; i++) {
					let split = arr[i].split(/\s*=\s*/);
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
					}
				}

				data.createSettings.setSimpleCv.consonants = consonants;
				data.createSettings.setSimpleCv.vowels = vowels;
				data.createSettings.setSimpleCv.patterns = patterns;
				break;
			default:
				break;
		}
	}

	/**
	 * JSONをダウンロードさせるための関数
	 * @param data JSON化するデータ
	 * @param filename デフォルトのファイル名
	 */
	function exportJson(data, filename) {
		let blob = new Blob([ JSON.stringify(data, undefined, 2) ], { type: "application/json" });

		if(window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, filename);
		}
		else {
			let a = document.createElement("a");
			a.download = filename;
			
			a.href = window.URL.createObjectURL(blob);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}

	}
})();
