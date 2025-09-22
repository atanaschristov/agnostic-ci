// Thanks to: https://www.geeksforgeeks.org/dsa/longest-common-prefix-using-sorting/
export function longestCommonPrefix(arr: string[]) {
	arr.sort();

	const first = arr[0];
	const last = arr[arr.length - 1];
	const minLength = Math.min(first.length, last.length);

	let i = 0;
	while (i < minLength && first[i] === last[i]) {
		i++;
	}

	return first.substring(0, i);
}

export function validateLanguageCode(languageCode: string) {
	return RegExp(/^([a-z]{2,3})(-[A-Z]{2,3})?$/).test(languageCode);
}
