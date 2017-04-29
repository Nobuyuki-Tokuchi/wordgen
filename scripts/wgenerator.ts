interface SimpleWGSetting {
	letters: string;
	input: number|string;
}

interface SimpleCvWGSetting {
	consonants: string;
	vowels: string;
	input: string;
}

class WordGenerator {
	public static simple_symbol = "simple";
	public static simplecv_symbol = "simplecv";

	public static simple(setting: SimpleWGSetting): string {
		let letters = setting.letters.split(",");
		let buffer = "";
		let count = typeof setting.input === "number" ?
			setting.input as number : parseInt(setting.input as string);

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

		for(let i = 0; i < setting.input.length; i++) {
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
}

