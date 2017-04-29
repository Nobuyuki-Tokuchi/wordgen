interface SimpleWGSetting {
	letters: string;
	patterns: string;
}

interface SimpleCvWGSetting {
	consonants: string;
	vowels: string;
	patterns: string;
}

class WordGenerator {
	public static simple_symbol = "simple";
	public static simplecv_symbol = "simplecv";

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

	public static simplecv(setting: SimpleCvWGSetting): string {
		let consonants = setting.consonants.split(",");
		let vowels = setting.vowels.split(",");
		let letters = consonants.concat(vowels);
		let buffer = "";
		let patternList = setting.patterns.split(",");
		let pattern = patternList[Math.floor(Math.random() * patternList.length)];

		for(let i = 0; i < pattern.length; i++) {
			switch(pattern[i]) {
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
}

