import bem from 'bem-cn';

import { useCallback, useEffect, useState } from 'react';
import { InputOptions } from './InputOptions.tsx';
// import { OptionsContextManager, ICommandActionParameter, IResponse } from 'agnostic-ci';
import { OptionsContextManager } from '../../../../../lib/';
import { ICommandActionParameter, IResponse } from '../../../../../lib/types.ts';
import { OverlayModal } from './OverlayModal.tsx';

import './DemoOptionsContextManager.scss';

interface IDemoOptionsContextManagerProps {
	readonly contextManager: OptionsContextManager;
	readonly processResponse: (response?: IResponse) => void;
}

function DemoOptionsContextManager(props: IDemoOptionsContextManagerProps) {
	const b = bem('tree-options');
	const { contextManager } = props;

	const [command, setCommand] = useState<{
		name?: string;
		parameterInfo?: ICommandActionParameter;
		value?: string;
	}>({});
	const [title, setTitle] = useState('');
	const [activePopUp, setActivePopUp] = useState(false);

	const getTitle = useCallback(() => {
		const { contextDepth } = contextManager;
		return contextDepth?.join(' / ') || '';
	}, [contextManager]);

	const processResponse = useCallback(
		(response?: IResponse) => {
			setTitle(getTitle());
			props.processResponse(response);
		},
		[getTitle, props],
	);

	useEffect(() => {
		setTitle(getTitle());
	}, [contextManager, getTitle]);

	useEffect(() => {
		if (command?.name && !activePopUp) {
			contextManager?.send({ command: command.name, argument: command.value });
			processResponse(contextManager?.response);
		}
	}, [activePopUp, contextManager, command]);

	const onSelectedOption = (command?: string): void => {
		if (!contextManager.requiresParameter(command)) setCommand({ name: command });
		else {
			setActivePopUp(true);
			setCommand({ name: command, parameterInfo: contextManager.getParametersInfo(command) });
		}
	};

	const onModalConfirm = (value?: string) => {
		setActivePopUp(false);
		setCommand({ ...command, value });
	};

	const onModalClose = () => {
		setActivePopUp(false);
		setCommand({});
	};

	return (
		<div className={b()}>
			<InputOptions
				title={title}
				commandOptions={contextManager.getCurrentContextCommands()}
				onSelectedOption={onSelectedOption}
				shouldListenToKeyPress={!activePopUp}
			/>
			{activePopUp && (
				<OverlayModal
					commandName={command.name || ''}
					parameterInfo={command.parameterInfo}
					onConfirm={onModalConfirm}
					onClose={onModalClose}
				/>
			)}
		</div>
	);
}

export default DemoOptionsContextManager;
