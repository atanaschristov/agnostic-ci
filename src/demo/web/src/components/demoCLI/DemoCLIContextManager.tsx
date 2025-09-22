import bem from 'bem-cn';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CLIContextManager } from '../../../../../lib/CLIContextManager.ts';
import { IResponse } from '../../../../../lib/types.ts';

import { COMMAND_SPLITTING_SYMBOL } from '../../../../../lib/constants.ts';

import './DemoCLIContextManager.scss';

interface IDemoCLIContextManagerProps {
	readonly contextManager: CLIContextManager;
	readonly processResponse: (response?: IResponse) => void;
}

function DemoCLIContextManager(props: IDemoCLIContextManagerProps) {
	const b = bem('cli');
	const inputRef = useRef<null | HTMLInputElement>(null);

	const [inputValue, setInputValue] = useState('');
	const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(-1);
	const [commandHistory, setCommandHistory] = useState<string[] | undefined>();

	const contextManager = useMemo(() => {
		return props.contextManager;
	}, [props.contextManager]);

	useEffect(() => {
		if (contextManager) {
			setInputValue(contextManager?.prompt);
		}
	}, [contextManager]);

	useEffect(() => {
		if (!commandHistory) return;
		setCommandHistoryIndex(commandHistory.length ? commandHistory.length : -1);
	}, [commandHistory]);

	useEffect(() => {
		if (!commandHistory) return;

		const command =
			commandHistoryIndex > -1 && commandHistoryIndex < commandHistory.length
				? commandHistory[commandHistoryIndex] + COMMAND_SPLITTING_SYMBOL
				: '';

		setInputValue(`${contextManager?.prompt}${command}`);
	}, [commandHistoryIndex, commandHistory, contextManager?.prompt]);

	const processResponse = (response?: IResponse, onAutocompleteRequest = false) => {
		const { code, autoCompleteOutput } = response || {};
		const { all } = autoCompleteOutput || {};

		if (onAutocompleteRequest) {
			setInputValue(`${contextManager?.prompt}${all}`);
		} else {
			if (contextManager?.currentContext) {
				const commandHistory = contextManager.commandHistory?.get(
					contextManager?.currentContext.name,
				);
				setCommandHistory(commandHistory);
				setCommandHistoryIndex(commandHistory?.length ? commandHistory.length : -1);
			}
			setInputValue(`${contextManager?.prompt}`);
		}

		if (!autoCompleteOutput || code !== 300) props.processResponse(response);
	};

	const onKeyDownHandler = function (event: React.KeyboardEvent<HTMLInputElement>) {
		switch (event.key) {
			case 'Enter':
			case 'Tab':
			case 'ArrowUp':
			case 'ArrowDown':
				event.preventDefault();
				break;
		}
	};

	const onKeyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const value = inputValue.substring(contextManager?.prompt.length);
		switch (event.key) {
			case 'Enter':
				contextManager?.send(value);
				processResponse(contextManager?.response);
				break;
			case 'Tab':
				contextManager?.autocomplete(value);
				processResponse(contextManager?.response, true);
				break;
			case 'ArrowUp':
				if (commandHistoryIndex > 0) setCommandHistoryIndex(commandHistoryIndex - 1);
				break;
			case 'ArrowDown':
				if (commandHistory && commandHistoryIndex < commandHistory.length)
					setCommandHistoryIndex(commandHistoryIndex + 1);
				break;
		}
	};

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.substring(contextManager?.prompt.length);
		setInputValue(`${contextManager?.prompt || ''}${value}`);
	};

	return (
		<div className={b()}>
			<input
				name="cliInput"
				ref={inputRef}
				type="text"
				className={b('input')}
				placeholder="Write your commands here..."
				value={inputValue}
				onKeyDown={onKeyDownHandler}
				onKeyUp={onKeyUpHandler}
				onChange={onChangeHandler}
				autoFocus
			></input>
		</div>
	);
}

export default DemoCLIContextManager;
