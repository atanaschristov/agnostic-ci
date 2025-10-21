import { CONTEXT_NAMES } from '../constants';
import { COMMAND_NAMES } from '../constants';

export const CODE = 'cz';

export default {
	[CONTEXT_NAMES.FONTS]: {
		[COMMAND_NAMES.FONT_SIZE]: {
			description: 'Změna velikosti písma',
		},
		[COMMAND_NAMES.FONT_STYLE]: {
			description: 'Nastaví styl písma',
		},
		[COMMAND_NAMES.RESET]: {
			description: 'Obnoví všechna nastavení písem',
		},
	},
	[CONTEXT_NAMES.STYLING]: {
		[COMMAND_NAMES.FONTS]: {
			description: 'Přejít do kontextu písem',
		},
		[COMMAND_NAMES.THEME]: {
			description: 'Změnit téma',
			hint: 'Téma může být tmavé, světlé, systémové',
		},
	},
	[CONTEXT_NAMES.SETTINGS_CONTEXT]: {
		[COMMAND_NAMES.STYLING]: {
			description: 'Přejít na kontext stylingu',
		},
		[COMMAND_NAMES.RESET]: {
			description: 'Obnoví všechna nastavení',
		},
	},
};
