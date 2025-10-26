import { ICommandActionParameter, ICommands, IContextContainer } from '../../lib/types';

export const generateContexts = (
	contextNames: string[],
	commands?: ICommands,
): IContextContainer => {
	const ContextCommands: IContextContainer = {};

	contextNames.forEach((name) => {
		const commandId = name.replace(/ /g, '');
		ContextCommands[commandId] = {
			name: commandId,
			commands: commands || {},
		};
	});

	return ContextCommands;
};

export const generateContextCommands = (commandNames: string[]): ICommands => {
	const ContextCommands: ICommands = {};

	commandNames.forEach((name) => {
		const commandId = name.replace(/ /g, '');
		ContextCommands[commandId] = {
			name: commandId,
			type: 'context',
			action: {
				name: `action${commandId}`,
			},
		};
	});

	return ContextCommands;
};

export const generateActionSetParameter = (
	options: string[],
	defaultValue?: string,
): ICommandActionParameter => {
	return { type: 'set', required: true, possibleValues: options, defaultValue };
};
