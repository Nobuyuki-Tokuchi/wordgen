var app;
var dialog;
var dialogVue;

(function () {
	window.addEventListener('load', function() {
		init();
	});

	function init() {
		dialog = new NtDialog("設定画面", {
			top: 100, left:500,
			width: 500, height: 200,
			style: 'default',
			draggable: true,
			dialog: document.getElementById('dialogs'),
		});

		let id = 1;
		app = new Vue({
			el: '#app',
			data: {
				words: [
				],
				zpdic: {
					alphabetOrder: "abcdefghijklmnopqrstuvwxyz"
				}
			},
			methods: {
				showDialog: function _showDialog() {
					dialog.show();
				},
				create: function _create() {
					let form = "";
					switch(dialogVue.mode.value) {
						case WordGenerator.simple_symbol:
							form = WordGenerator.simple(dialogVue.createSetting.setSimple);
							break;
						case WordGenerator.simplecv_symbol:
							form = WordGenerator.simplecv(dialogVue.createSetting.setSimpleCv);
							break;
						default:
							break;
					}

					this.words.push({
						entry: {
							id: id++,
							form: form,
						},
						translations: [
							{
								forms: [""],
								title: "",
							},
						],
						tags: [],
						contents: [],
						variations: [],
						relations: [],
					});
				},
				outputJson: function _outputJson() {
					let blob = new Blob([ JSON.stringify(this.$data, undefined, 2) ], { type: "application/json" });
					console.log(blob);

					if(window.navigator.msSaveBlob) {
						window.navigator.msSaveBlob(blob, "data.json");
					}
					else {
						let a = document.createElement("a");
						a.download = "data.json";
						
						a.href = window.URL.createObjectURL(blob);
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					}
				},
				remove: function _remove(index) {
					this.words.splice(index, 1);
				},
			},
		});

		dialogVue = new Vue({
			el: '#dialogVue',
			data: {
				mode: {
					value: 'simple',
					options: [
						{ text: '単純文字列生成', value: WordGenerator.simple_symbol },
						{ text: '母子音別定義単純文字列生成', value: WordGenerator.simplecv_symbol },
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
					return this.mode.value === WordGenerator.simple_symbol;
				},
				isSimpleCv: function _isSimpleCv() {
					return this.mode.value === WordGenerator.simplecv_symbol;
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
							case WordGenerator.simple_symbol:
								let letters = [];
								for(let i = 0; i < arr.length; i++) {
									letters = letters.concat(arr[i].split(","));
								}

								this_.createSetting.setSimple.letters = letters.join(",");
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
