// Thanks to: https://www.geeksforgeeks.org/dsa/longest-common-prefix-using-sorting/
export function longestCommonPrefix(arr: string[]) {
	arr.sort();

	let first = arr[0];
	let last = arr[arr.length - 1];
	let minLength = Math.min(first.length, last.length);

	let i = 0;
	while (i < minLength && first[i] === last[i]) {
		i++;
	}

	return first.substring(0, i);
}

export function validateLanguageCode(languageCode: string) {
	return RegExp(/^([a-z]{2,3})(-[A-Z]{2,3})?$/).test(languageCode);
}
