var app;
var dialog;
var dialogVue;

(function () {
	window.addEventListener('load', function() {
		init();
	});

	function WGenerator() {}

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
						case 'simple':
							this.results.push({
								text: WGenerator.simple(dialogVue.createSetting.setSimple),
							});
							break;
						case 'simplecv':
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
						{ text: '単純文字列生成', value: 'simple' },
						{ text: '母子音別定義単純文字列生成', value: 'simplecv' },
						//{ text: '多定義文字列生成', value: 'manytype' },
					],
				},
				createSetting: {
					setSimple: {
						letters: "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,r,s,t,u,v,w,x,y,z",
						input: 4
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
					return this.mode.value === 'simple';
				},
				isSimpleCv: function _isSimpleCv() {
					return this.mode.value === 'simplecv';
				},
			},
			methods: {
				inputSetting: function _inputSetting() {
				}
			}
		});
	}
})();
