import { ICommandNode, ICommands, IContextContainer, IContextDefinition } from '../../../lib/types';
import { UISettingsCommand } from '../sharedCommands';
import { ContextEntryCommand as EbookCommand } from '../ebook';
import { ContextEntryCommand as DocumentationEntryCommand } from '../docs';
import { EntryCommand as MultiLevelEntryCommand } from '../multiLevel';

export const CONTEXT_NAMES = {
	LOBBY: 'lobby' as const,
};

export const COMMAND_NAMES = {
	LOBBY_UI_SETTINGS: UISettingsCommand.name,
	LOBBY_EBOOK: EbookCommand.name,
	LOBBY_DOCUMENTATION: DocumentationEntryCommand.name,
	LOBBY_MULTI_LEVEL: MultiLevelEntryCommand.name,
};

export const LobbyCommand = {
	name: CONTEXT_NAMES.LOBBY,
	type: 'context',
} as ICommandNode;

export const LobbyContext = {
	name: CONTEXT_NAMES.LOBBY,
	isInitialContext: true,
	commands: {
		[COMMAND_NAMES.LOBBY_UI_SETTINGS]: UISettingsCommand,
		[COMMAND_NAMES.LOBBY_EBOOK]: EbookCommand,
		[COMMAND_NAMES.LOBBY_DOCUMENTATION]: DocumentationEntryCommand,
		[MultiLevelEntryCommand.name]: MultiLevelEntryCommand,
	} as ICommands,
} as IContextDefinition;

export default {
	[LobbyContext.name]: LobbyContext,
} as IContextContainer;
