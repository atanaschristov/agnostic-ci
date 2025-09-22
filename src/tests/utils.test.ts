import { longestCommonPrefix, validateLanguageCode } from '../lib/utils';

describe('utils', () => {
	it('longestCommonPrefix', () => {
		expect(longestCommonPrefix(['a', 'b'])).toBe('');
		expect(longestCommonPrefix(['a', 'aaaaa'])).toBe('a');
		expect(longestCommonPrefix(['aa', 'aaaaa'])).toBe('aa');
		expect(longestCommonPrefix(['aaaaa', 'aa'])).toBe('aa');
		expect(longestCommonPrefix(['aaaaa', 'aa', 'b'])).toBe('');
	});

	it('validateLanguageCode', () => {
		expect(validateLanguageCode('en')).toBeTruthy();
		expect(validateLanguageCode('en-GB')).toBeTruthy();
		expect(validateLanguageCode('nop')).toBeTruthy(); // checking only the form of the string
		expect(validateLanguageCode('nop-NOP')).toBeTruthy();

		expect(validateLanguageCode('e')).toBeFalsy();
		expect(validateLanguageCode('en-')).toBeFalsy();
		expect(validateLanguageCode('nope')).toBeFalsy();
		expect(validateLanguageCode('nop-NOPE')).toBeFalsy();
		expect(validateLanguageCode('-GB')).toBeFalsy();
	});
});
