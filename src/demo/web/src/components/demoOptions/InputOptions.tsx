import bem from 'bem-cn';
import { useCallback, useEffect } from 'react';
import './InputOptions.scss';

export interface IInputOptionsProps {
	title: string;
	commandOptions: string[];
	onSelectedOption: (options: string) => void;
	shouldListenToKeyPress?: boolean;
}

export const InputOptions = (props: IInputOptionsProps) => {
	const b = bem('tree-options__input');
	const { shouldListenToKeyPress, commandOptions, onSelectedOption } = props;

	const onKeyPress = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault();
			const commandIndex = parseInt(event.key);

			if (isNaN(commandIndex)) return;

			onSelectedOption(commandOptions[commandIndex - 1]);
		},
		[commandOptions, onSelectedOption],
	);

	useEffect(() => {
		if (shouldListenToKeyPress) document.addEventListener('keypress', onKeyPress);
		else document.removeEventListener('keypress', onKeyPress);

		return () => {
			document.removeEventListener('keypress', onKeyPress);
		};
	}, [onKeyPress, shouldListenToKeyPress]);

	const generateOptionsListItems = (commandOptions: string[]) => {
		let counter = 0;
		return commandOptions.map((option) => {
			return (
				<li key={counter++}>
					<button onClick={onOptionClick}>{option}</button>
				</li>
			);
		});
	};

	const onOptionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const command = (event.target as HTMLButtonElement).innerText;
		if (!commandOptions.includes(command)) throw new Error(`Invalid option: ${command}`);

		onSelectedOption(command);
	};

	return (
		<div className={b()}>
			<div>{props.title.toUpperCase()}</div>
			<ol className={b('list')}>{generateOptionsListItems(commandOptions)}</ol>
		</div>
	);
};
