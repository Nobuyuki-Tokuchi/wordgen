///<reference path="./otmword.ts" />
///<reference path="./wmmodules.ts" />
///<reference path="./wgenerator.ts" />
///<reference path="./ntdialog.ts" />

interface EquivalentChoiceData {
	translations: string[];
	selectedValue: string;
	dictionary: OtmDictionary;
}

class EquivalentChoiceVM {
	el: string;
	data: EquivalentChoiceData;
	methods: {[key: string]: any};

	constructor(el: string, dict: OtmDictionary) {
		this.el = el;
		this.data = <EquivalentChoiceData> {
			translations: WMModules.EQUIVALENTS,
			selectedValue: "",
			dictionary: dict,
		};

		this.initMethods();
	}

	private initMethods(): void {
		this.methods = {
			addTranslation: function _addTranslation() {
				if(this.selectedValue == null || this.selectedValue !== "") {
				}
			},
			cancel: function _cancel() {
			},
		};
	}
}
