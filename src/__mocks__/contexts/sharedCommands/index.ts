import exitCmd from './exitCmd';
import uiSettingsCommand from './uiSettingsCmd';
import listCommand from './listCommand';

export const SHARED_COMMAND_NAMES = {
	EXIT: exitCmd.name,
	LIST: listCommand.name,
	UI_SETTINGS: uiSettingsCommand.name,
};

export { exitCmd, uiSettingsCommand, listCommand };
