import bem from 'bem-cn';
import DemoCLIContextManager from './components/demoCLI/DemoCLIContextManager.tsx';
import DemoOptionsContextManager from './components/demoOptions/DemoOptionsContextManager.tsx';

import { ACTIONS } from './actions';
import { ContentScreen, IScreenItem } from './components/ContentScreen.tsx';
import { useCallback, useMemo, useState } from 'react';
// TODO from the library
import { ContextManager, type CLIContextManager, type OptionsContextManager } from '../../../lib/';
// TODO from the library
import { IActionResponse, IResponse } from '../../../lib/types';
import { useSchema } from './utils.ts';

import './App.scss';

type DemoOptions = 'cli' | 'options';

export interface IResponseHistory {
	success: boolean;
	message: string;
}

function App() {
	const b = bem('app');
	const INITIAL_MANAGER: DemoOptions = 'cli';
	const [selectedDemo, setSelectedDemo] = useState<DemoOptions>(INITIAL_MANAGER);
	const [screenItem, setScreenItem] = useState<IScreenItem | undefined>(undefined);

	const onButtonClick = (target: DemoOptions) => {
		setSelectedDemo(target);
	};

	const commandActions = useMemo(() => {
		return { ...ACTIONS };
	}, []);

	const preparedSchema = useSchema();

	const contextManagers = useMemo(() => {
		const { LOCALES, SCHEMA } = preparedSchema;
		const cli = new ContextManager('cli').managerInstance;
		cli?.initialize(structuredClone(SCHEMA), structuredClone(LOCALES));

		const options = new ContextManager('options').managerInstance;
		options?.initialize(structuredClone(SCHEMA), structuredClone(LOCALES));

		return {
			cli,
			options,
		};
	}, []);

	const processResponse = useCallback((response?: IResponse) => {
		if (!response) return;

		const { success, actions, info } = response;
		let { message } = response;

		message = info?.command?.name ? `${message} (${info?.command?.name})` : message;

		if (!actions?.length) setScreenItem({ success, content: message });
		else actions?.forEach((action) => processAction(success, message, action));
	}, []);

	const processAction = async (success: boolean, message: string, action: IActionResponse) => {
		const { name, parameter } = action || {};

		if (name && commandActions?.[name as keyof typeof commandActions]) {
			const actionOutput = await commandActions[name as keyof typeof commandActions](parameter);

			if (actionOutput) setScreenItem({ success, content: actionOutput });
			else setScreenItem({ success, content: message });
		} else setScreenItem({ success, content: message });
	};

	return (
		<div className={b()}>
			<div className={b('navigation-bar')}>
				<table className={b('navigation-bar', 'version-info')}>
					<tr>
						<td>DEMO</td>
						<td>: {__DEMO_VERSION__}</td>
					</tr>
					<tr>
						<td>LIB</td>
						<td>: {__LIB_VERSION__}</td>
					</tr>
				</table>
				<h2>Demos</h2>
				<div className={b('navigation-bar', 'options')}>
					<button
						onClick={() => onButtonClick('cli')}
						className={b('navigation-bar', 'options', { selected: selectedDemo === 'cli' })}
					>
						Command Line Interface
					</button>
					<button
						onClick={() => onButtonClick('options')}
						className={b('navigation-bar', 'options', {
							selected: selectedDemo === 'options',
						})}
					>
						Command Options Interface
					</button>
				</div>
			</div>
			<div className={b('demo-container')}>
				<ContentScreen messageItem={screenItem} selectedDemo={selectedDemo} />
				{selectedDemo === 'cli' && contextManagers[selectedDemo] && (
					<DemoCLIContextManager
						contextManager={contextManagers[selectedDemo] as CLIContextManager}
						processResponse={processResponse}
					/>
				)}
				{selectedDemo === 'options' && (
					<DemoOptionsContextManager
						contextManager={contextManagers[selectedDemo] as OptionsContextManager}
						processResponse={processResponse}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
