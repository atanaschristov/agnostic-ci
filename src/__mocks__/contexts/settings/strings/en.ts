import { COMMAND_NAMES, CONTEXT_NAMES } from '../constants';

export const CODE = 'en';

export default {
	[CONTEXT_NAMES.FONTS]: {
		[COMMAND_NAMES.FONT_SIZE]: {
			description: 'Change the font size',
		},
		[COMMAND_NAMES.FONT_STYLE]: {
			description: 'Sets the font style',
		},
		[COMMAND_NAMES.RESET]: {
			description: 'Resets all fonts settings',
		},
	},
	[CONTEXT_NAMES.STYLING]: {
		[COMMAND_NAMES.FONTS]: {
			description: 'Go to fonts context',
		},
		[COMMAND_NAMES.THEME]: {
			description: 'Change the theme',
			hint: 'The theme can be dark, light, system',
		},
	},
	[CONTEXT_NAMES.SETTINGS_CONTEXT]: {
		[COMMAND_NAMES.UI_SETTINGS_STYLING]: {
			description: 'Go to styling context',
		},
		[COMMAND_NAMES.UI_SETTINGS_RESET]: {
			description: 'Resets all settings',
		},
	},
};
