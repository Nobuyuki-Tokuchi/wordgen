var app;
var dialog;
var dialogVue;

(function () {
	window.addEventListener('load', function() {
		init();
	});

	function WGenerator() {}

	WGenerator.simple_symbol = 'simple';
	WGenerator.simplecv_symbol = 'simplecv';

	WGenerator.simple = function _wg_simple(setting) {
		var letters = setting.letters.split(",");
		var buffer = "";

		for(var i = 0; i < setting.input; i++) {
			buffer += letters[Math.floor(Math.random() * letters.length)];
		}

		return buffer;
	};

	WGenerator.simplecv = function _wg_simplecv(setting) {
		var consonants = setting.consonants.split(",");
		var vowels = setting.vowels.split(",");
		var letters = consonants.concat(vowels);
		var buffer = "";

		for(var i = 0; i < setting.input.length; i++) {
			switch(setting.input[i]) {
				case "C":
				case "c":
					buffer += consonants[Math.floor(Math.random() * consonants.length)];
					break;
				case "V":
				case "v":
					buffer += vowels[Math.floor(Math.random() * vowels.length)];
					break;
				case "*":
					buffer += letters[Math.floor(Math.random() * letters.length)];
					break;
				default:
					buffer += "-";
					break;
			}
		}

		return buffer;
	}

	function init() {
		dialog = new vziek.VDialog("設定画面", {
			top: 100, left:500,
			width: 500, height: 200,
			style: 'default',
			draggable: true,
			dialog: document.getElementById('dialogs'),
		});

		app = new Vue({
			el: '#app',
			data: {
				results: [
				],
			},
			methods: {
				showDialog: function _showDialog() {
					dialog.show();
				},
				create: function _create() {
					switch(dialogVue.mode.value) {
						case WGenerator.simple_symbol:
							this.results.push({
								text: WGenerator.simple(dialogVue.createSetting.setSimple),
							});
							break;
						case WGenerator.simplecv_symbol:
							this.results.push({
								text: WGenerator.simplecv(dialogVue.createSetting.setSimpleCv),
							});
							break;
						default:
							break;
					}
				},
				outputJson: function _outputJson() {
				},
				remove: function _remove(index) {
					this.results.splice(index, 1);
				},
			},
		});

		dialogVue = new Vue({
			el: '#dialogVue',
			data: {
				mode: {
					value: 'simple',
					options: [
						{ text: '単純文字列生成', value: WGenerator.simple_symbol },
						{ text: '母子音別定義単純文字列生成', value: WGenerator.simplecv_symbol },
						//{ text: '多定義文字列生成', value: 'manytype' },
					],
				},
				createSetting: {
					setSimple: {
						letters: "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,r,s,t,u,v,w,x,y,z",
						input: 5,
					},
					setSimpleCv: {
						consonants: "b,c,d,f,g,h,j,k,l,m,n,p,r,s,t,v,w,x,z",
						vowels: "a,e,i,o,u,y",
						input: "CVCCV",
					}
				},
			},
			computed: {
				isSimple: function _isSimple() {
					return this.mode.value === WGenerator.simple_symbol;
				},
				isSimpleCv: function _isSimpleCv() {
					return this.mode.value === WGenerator.simplecv_symbol;
				},
			},
			methods: {
				inputSetting: function _inputSetting(ev) {
					let reader = new FileReader();
					reader.readAsText(ev.target.files[0]);

					let this_ = this;
					reader.onload = function _reader_onload(loadEv) {
						let arr = reader.result.replace('\r\n', '\n').replace('\r', '\n').split('\n');
						arr = arr.filter(function(el) {
							return el !== "" && !el.startsWith("#");
						});

						switch(this_.mode.value) {
							case WGenerator.simple_symbol:
								let letters = [];
								for(let i = 0; i < arr.length; i++) {
									letters = letters.concat(arr[i].split(","));
								}

								this_.createSetting.setSimple.letters = letters.join(",");
								break;
							case WGenerator.simplecv_symbol:
								let consonants = "";
								let vowels = "";

								for(let i = 0; i < arr.length; i++) {
									let split = arr[i].split(/[ ]?=[ ]?/);
									switch(split[0]) {
										case "consonants":
											consonants = split[1];
											break;
										case "vowels":
											vowels = split[1];
											break;
									}
								}

								this_.createSetting.setSimpleCv.consonants = consonants;
								this_.createSetting.setSimpleCv.vowels = vowels;
								break;
							default:
								break;
						}
						console.log(arr);
					}
				}
			}
		});
	}
})();
