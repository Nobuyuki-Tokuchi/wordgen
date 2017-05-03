/**
 * 単純文字列生成用の引数を表すインターフェイス
 */
interface SimpleWGSetting {
	letters: string;
	patterns: string;
}

/**
 * 母子音別定義単純文字列生成用の引数を表すインターフェイス
 */
interface SimpleCvWGSetting {
	consonants: string;
	vowels: string;
	patterns: string;
}

/**
 * 文字列生成器クラス
 */
class WordGenerator {
	/**
	 * 単純文字列生成を表すシンボル
	 */
	public static simple_symbol = "simple";

	/**
	 * 母子音別定義単純文字列生成を表すシンボル
	 */
	public static simplecv_symbol = "simplecv";

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

		for(let i = 0; i < count; i++) {
			buffer += letters[Math.floor(Math.random() * letters.length)];
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

		for(let i = 0; i < pattern.length; i++) {
			switch(pattern[i].toUpperCase) {
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
		}

		return buffer;
	}
}

