import { COMMAND_TRANSLATIONS } from './commandStrings';
import {
	CLI_IMPLICIT_COMMANDS,
	IMPLICIT_COMMANDS,
	IMPLICIT_CONTEXTS,
	CLI_IMPLICIT_CONTEXTS,
} from './ImplicitCommands';

export default {
	locales: COMMAND_TRANSLATIONS,
	commands: {
		common: IMPLICIT_COMMANDS,
		cli: CLI_IMPLICIT_COMMANDS,
		treeGraph: undefined,
	},
	contexts: {
		common: IMPLICIT_CONTEXTS,
		cli: CLI_IMPLICIT_CONTEXTS,
		treeGraph: undefined,
	},
};
