/**
 * 単純文字列生成用の引数を表すインターフェイス
 */
interface SimpleWGSetting {
	letters: string;
	patterns: string;
	prohibitions: string;
}

/**
 * 母子音字別定義単純文字列生成用の引数を表すインターフェイス
 */
interface SimpleCvWGSetting {
	consonants: string;
	vowels: string;
	patterns: string;
	prohibitions: string;
}

/**
 * 母子音字別定義依存遷移型文字列生成用の引数を表すインターフェイス
 */
interface DependencyCvWGSetting extends SimpleCvWGSetting {
	transitions: DependencyCvTransition[];
	prohibitions: string;
}

/**
 * 母子音字別定義依存遷移型の遷移先パラメータ
 */
interface DependencyCvTransition {
	letter: string;
	nextLetters: string;
}

/**
 * 文字列生成器クラス
 */
class WordGenerator {
	/**
	 * 単純文字列生成を表すシンボル
	 */
	public static SIMPLE_SYMBOL = "simple";

	/**
	 * 母子音文字別定義単純文字列生成を表すシンボル
	 */
	public static SIMPLECV_SYMBOL = "simplecv";

	/**
	 * 母子音文字別定義依存遷移型文字列生成を表示シンボル
	 */
	public static DEPENDENCYCV_SYMBOL = "dependencycv";

	/**
	 * 単純文字列生成を行うメソッド
	 * @param setting 文字列を生成する時に使用する設定
	 * @return 生成した文字列
	 */
	public static simple(setting: SimpleWGSetting): string {
		let letters = setting.letters.split(",");
		let buffer = "";
		let countList = setting.patterns.split(",");
		let count = parseInt(countList[Math.floor(Math.random() * countList.length)]);
		let prohibitions = WordGenerator.getProhibitions(setting.prohibitions);

		for(let i = 0; i < count; i++) {
			buffer += letters[Math.floor(Math.random() * letters.length)];

			let isOk = prohibitions.length === 0 || prohibitions.every((x) => {
				return !buffer.endsWith(x);
			});

			if(!isOk) {
				buffer = buffer.substr(0, buffer.length - 1);
				i--;
			}
		}

		return buffer;
	}

	/**
	 * 母子音別定義単純文字列生成を行うメソッド
	 * @param setting 文字列を生成する時に使用する設定
	 * @return 生成した文字列
	 */
	public static simplecv(setting: SimpleCvWGSetting): string {
		let consonants = setting.consonants.split(",");
		let vowels = setting.vowels.split(",");
		let letters = consonants.concat(vowels);
		let buffer = "";
		let patternList = setting.patterns.split(",");
		let pattern = patternList[Math.floor(Math.random() * patternList.length)];
		let prohibitions = WordGenerator.getProhibitions(setting.prohibitions);

		for(let i = 0; i < pattern.length; i++) {
			switch(pattern[i].toUpperCase()) {
				case "C":
					buffer += consonants[Math.floor(Math.random() * consonants.length)];
					break;
				case "V":
					buffer += vowels[Math.floor(Math.random() * vowels.length)];
					break;
				case "*":
					buffer += letters[Math.floor(Math.random() * letters.length)];
					break;
				default:
					buffer += "-";
					break;
			}

			let isOk = prohibitions.length === 0 || prohibitions.every((x) => {
				return !buffer.endsWith(x);
			});

			if(!isOk) {
				buffer = buffer.substr(0, buffer.length - 1);
				i--;
			}
		}

		return buffer;
	}

	/**
	 * 母子音別定義依存遷移型文字列生成を行うメソッド
	 * @param setting 文字列を生成する時に使用する設定
	 * @return 生成した文字列
	 */
	public static dependencycv(setting: DependencyCvWGSetting): string {
		let consonants = setting.consonants.split(",").map((x) => x.trim());
		let vowels = setting.vowels.split(",").map((x) => x.trim());
		let letters = consonants.concat(vowels);
		let buffer = "";
		let patternList = setting.patterns.split(",").map((x) => x.trim());
		let pattern = patternList[Math.floor(Math.random() * patternList.length)];
		let prohibitions = WordGenerator.getProhibitions(setting.prohibitions);

		let oldLetter = ""
		for(let i = 0; i < pattern.length; i++) {
			let letterList = null;

			if(oldLetter === "") {
				switch(pattern[i].toUpperCase()) {
					case "C":
						letterList = consonants;
						break;
					case "V":
						letterList = vowels;
						break;
					case "*":
						letterList = letters;
						break;
					default:
						letterList = ["-"];
						break;
				}
			}
			else {
				let nextLetters = null;
				setting.transitions.forEach((x) => {
					if(x.letter === oldLetter) {
						nextLetters = x.nextLetters.split(",");
						return;
					}
				});

				if(nextLetters !== null) {
					switch(pattern[i].toUpperCase()) {
						case "C":
							letterList = nextLetters.filter((c) => {
								return consonants.indexOf(c) !== -1;
							});
							break;
						case "V":
							letterList = nextLetters.filter((c) => {
								return vowels.indexOf(c) !== -1;
							});
							break;
						case "*":
							letterList = nextLetters;
							break;
						default:
							letterList = ["-"];
							break;
					}
				}
			}

			if(letterList === null || letterList.length === 0) {
				letterList = ["-"];
			}

			oldLetter = letterList[Math.floor(Math.random() * letterList.length)];
			buffer += oldLetter;

			let isOk = prohibitions.length === 0 || prohibitions.every((x) => {
				return !buffer.endsWith(x);
			});

			if(!isOk) {
				buffer = buffer.substr(0, buffer.length - 1);
				i--;
			}
		}

		return buffer;
	}

	private static getProhibitions(prohibitions: string): string[] {
		if(prohibitions == null || prohibitions.trim().length === 0) {
			return [];
		}
		else {
			return prohibitions.split(",").map((x) => x.trim());
		}
	}
}

