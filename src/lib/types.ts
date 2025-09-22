type CommandType = 'command' | 'context' | 'help';

export type NormalizedCommand = string[];

export interface IContextContainer {
	[key: string]: IContextDefinition;
}

export interface IContextDefinition {
	name: string;
	isRootContext?: boolean;
	isInitialContext?: boolean;
	commands: ICommands;
}

export interface ICommands {
	[key: string]: ICommandNode;
}

export interface IMetaInfo {
	description?: string; // contains generic description answering questions like: What, Why etc...
	extendedDescription?: string;
	hint?: string; // contains info on how it works
	example?: string; // example supporting the hint if needed
}

export interface ICommandNode extends IMetaInfo {
	name: string;
	type: CommandType;
	action?: ICommandAction;
	// actions?: IActionListDefinition;
	aliases?: string[];
}

export interface ICommandActionParameter extends IMetaInfo {
	type: 'string' | 'number' | 'boolean' | 'object' | 'set';
	required?: boolean;
	defaultValue?: string;
	possibleValues?: string[];
	valueFormatLimitation?: RegExp;
}

export interface ICommandAction extends IMetaInfo {
	name: string;
	parameter?: ICommandActionParameter;
}

export interface IActionResponseParameter extends IMetaInfo {
	value?: string;
	required?: boolean;
	valueFormatLimitation?: RegExp;
	possibleParameters?: unknown[];
}

export interface IActionResponse extends IMetaInfo {
	name: string;
	parameter?: IActionResponseParameter;
}

export interface IProcessedParameter extends IMetaInfo {
	value?: string;
	defaultValue?: string;
	possibleValues?: string[];
}

export interface IProcessedCommand extends IMetaInfo {
	name?: string;
	possibleNames?: string[];
}

export interface IAdditionalInfo {
	isNameOrValuePartial?: boolean;
}

export interface IProcessedInput {
	processedDepth?: string[];
	processedInputString?: string;
	pendingActions?: IActionResponse[];
	command?: IProcessedCommand & IAdditionalInfo;
	parameter?: IProcessedParameter & IAdditionalInfo;
	error?: {
		success: boolean;
		message: string;
		code: number;
	};
}

export interface IAutocompleteOutput {
	commands?: string;
	parameters?: string;
	all?: string; // complete autocompleted input
}

export interface IResponseInfo {
	command?: IProcessedCommand;
	parameter?: IProcessedParameter;
	contextDepth?: string[];
	prompt?: string;
}

export interface IResponse {
	success: boolean;
	message: string;
	code: number;
	actions?: IActionResponse[];
	autoCompleteOutput?: IAutocompleteOutput;
	info?: IResponseInfo;
}

export interface ILocaleStrings {
	[key: string]: string | ILocaleStrings | undefined;
}
