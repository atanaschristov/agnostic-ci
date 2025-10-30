import { Terminal } from 'terminal-kit';
import type {
	CLIContextManager,
	IContextContainer,
	ILocaleStrings,
	IResponse,
} from 'agnostic-ci/es5';

export default class CLIApp {
	private terminal: Terminal;
	private contextManager: CLIContextManager;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private inputFieldInstance: any = null;
	private commandHistory: string[] | undefined = [];
	private commandHistoryIndex: number = -1;

	constructor(
		terminal: Terminal,
		contextManager: CLIContextManager,
		Mocks: { default: IContextContainer; COMMAND_STRINGS?: ILocaleStrings },
	) {
		const CommandSchema = Mocks.default;
		const CommandStrings = Mocks.COMMAND_STRINGS;

		this.terminal = terminal;
		this.contextManager = contextManager;
		this.contextManager.initialize(CommandSchema, CommandStrings);
	}

	start() {
		this.promptLoop();
		this.terminal.on('key', this.handleKey.bind(this));
	}

	private recreateInputFieldInstance(inputValue = '') {
		this.inputFieldInstance?.abort();
		this.terminal.eraseLine();
		this.terminal.column(1);
		this.terminal(`${this.contextManager.prompt}`);

		this.inputFieldInstance = this.terminal.inputField(
			{ cancelable: true, default: inputValue },
			(error: unknown, input?: string) => {
				this.contextManager.send(input);
				const { response } = this.contextManager;

				this.commandHistory =
					this.contextManager.commandHistory?.get(
						this.contextManager.currentContext?.name || '',
					) || [];
				this.commandHistoryIndex = this.commandHistory?.length
					? this.commandHistory.length
					: -1;

				this.promptLoop(response);
			},
		);
	}

	private promptLoop(
		response: IResponse | undefined = undefined,
		inputValue = '',
		hint: string | undefined = undefined,
	) {
		if (response) this.terminal(`\n${JSON.stringify(response, null, '\t')}\n`);
		if (hint) this.terminal(`\n${hint}\n`);
		this.recreateInputFieldInstance(inputValue);
	}

	private handleKey(name: string) {
		switch (name) {
			case 'CTRL_C':
				this.terminal.grabInput(false);
				this.terminal('\nGoodbye!\n');
				process.exit(0);
			// fall through: Comment needed by the linter. No need for break. Just exits the app
			case 'TAB': {
				const currentInput = this.inputFieldInstance?.getInput() || '';
				this.contextManager.autocomplete(currentInput);
				const { response } = this.contextManager;
				const { autoCompleteOutput, info } = response || {};
				const { command, parameter } = info || {};
				const parameterHint = parameter?.hint;
				const commandHint = command?.hint;
				this.promptLoop(
					undefined,
					autoCompleteOutput?.all ?? currentInput,
					commandHint || parameterHint || undefined,
				);
				break;
			}
			case 'UP': {
				if (this.commandHistoryIndex > 0) {
					this.commandHistoryIndex -= 1;
					const command = this.commandHistory?.[this.commandHistoryIndex];
					if (command) {
						this.promptLoop(undefined, command);
					}
				}
				break;
			}
			case 'DOWN': {
				if (this.commandHistory && this.commandHistoryIndex < this.commandHistory.length) {
					this.commandHistoryIndex += 1;
					const command = this.commandHistory[this.commandHistoryIndex];
					if (command) {
						this.promptLoop(undefined, command);
					} else {
						this.promptLoop();
					}
				} else {
					this.promptLoop();
				}
				break;
			}
		}
	}
}
