import { ICommandNode, ICommands, IContextContainer, IContextDefinition } from '../../../lib/types';
import { UISettingsCommand } from '../sharedCommands';
import { ContextEntryCommand as EbookCommand } from '../ebook';
import { ContextEntryCommand as DocumentationEntryCommand } from '../docs';
import { EntryCommand as MultiLevelEntryCommand } from '../multiLevel';

export const ACTION_NAMES = {
	LOBBY_WELCOME_SCREEN: 'welcomeScreenAction' as const,
	LOBBY_TODO: 'todoAction' as const,
};

export const CONTEXT_NAMES = {
	LOBBY: 'lobby' as const,
};

export const COMMAND_NAMES = {
	LOBBY_UI_SETTINGS: UISettingsCommand.name,
	LOBBY_EBOOK: EbookCommand.name,
	LOBBY_DOCUMENTATION: DocumentationEntryCommand.name,
	LOBBY_MULTI_LEVEL: MultiLevelEntryCommand.name,
	LOBBY_WELCOME_SCREEN: 'welcomeScreen' as const,
	LOBBY_TODO: 'todo' as const,
};

export const LobbyCommand = {
	name: CONTEXT_NAMES.LOBBY,
	type: 'context',
} as ICommandNode;

const WelcomeScreenCommand: ICommandNode = {
	name: COMMAND_NAMES.LOBBY_WELCOME_SCREEN,
	type: 'command',
	action: {
		name: ACTION_NAMES.LOBBY_WELCOME_SCREEN,
	},
};

const TodoCommand: ICommandNode = {
	name: COMMAND_NAMES.LOBBY_TODO,
	type: 'command',
	action: {
		name: ACTION_NAMES.LOBBY_TODO,
	},
};

export const LobbyContext = {
	name: CONTEXT_NAMES.LOBBY,
	isInitialContext: true,
	commands: {
		[COMMAND_NAMES.LOBBY_UI_SETTINGS]: UISettingsCommand,
		[COMMAND_NAMES.LOBBY_EBOOK]: EbookCommand,
		[COMMAND_NAMES.LOBBY_DOCUMENTATION]: DocumentationEntryCommand,
		[MultiLevelEntryCommand.name]: MultiLevelEntryCommand,
		[COMMAND_NAMES.LOBBY_WELCOME_SCREEN]: WelcomeScreenCommand,
		[COMMAND_NAMES.LOBBY_TODO]: TodoCommand,
	} as ICommands,
} as IContextDefinition;

export default {
	[LobbyContext.name]: LobbyContext,
} as IContextContainer;
