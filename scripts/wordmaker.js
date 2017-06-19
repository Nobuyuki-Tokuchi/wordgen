var wordDisplay;
var settings;
var equivalentChoice;

(function () {
	// 画面ロード時に初期化処理を呼び出す
	window.addEventListener('load', function __init__() {
		init();
		window.removeEventListener('load', __init__);
	});

	let createSetting = WMModules.createSetting();
	let dictionary = new OtmDictionary();
	let equivalent = {
		translations: WMModules.defaultEquivalents(),
		selectedValue: "",
		selectedWordId: "",
	};

	// 初期化用関数
	function init() {
		WMModules.equivalentDialog = new NtDialog("訳語ダイアログ", {
			top: 100, left:500,
			width: 300, height: 200,
			style: 'flat',
			draggable: true,
			dialog: document.getElementById('equivalentDialog'),
		});

		// 生成文字列一覧のVMの初期化
		wordDisplay = new Vue(new WordDisplayVM("#wordDisplay", dictionary, createSetting, equivalent));

		// 設定部分のVMの初期化
		settings = new Vue(new SettingVM("#settings", createSetting));

		// 訳語選択部分のVMの初期化
		equivalentChoice = new Vue(new EquivalentChoiceVM("#equivalentChoice", dictionary, equivalent));
	}
})();

