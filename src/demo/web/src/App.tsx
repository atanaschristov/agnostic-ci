import bem from 'bem-cn';
import DemoCLIContextManager from './components/demoCLI/DemoCLIContextManager.tsx';
import DemoOptionsContextManager from './components/demoOptions/DemoOptionsContextManager.tsx';

import { useMemo, useState } from 'react';
import { OptionsContextManager } from '../../../lib/OptionsContextManager.ts';
import { IActionResponse, IContextContainer, IResponse } from '../../../lib/types.ts';
import { CLIContextManager } from '../../../lib/CLIContextManager.ts';
import { ContextManager } from '../../../lib/ContextManager.ts';

// import ContextSchema from '../../../__mocks__/contexts/index.ts';
import COMMAND_INTERFACE from './commandInterface';
import { ACTIONS } from './actions';

import './App.scss';
import { ContentScreen, IScreenItem } from './components/ContentScreen.tsx';

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
		return { ...COMMAND_INTERFACE.DOC.ACTIONS, ...ACTIONS };
	}, []);

	const contextManagers = useMemo(() => {
		const prepareSchema = () => {
			// ContextSchema.lobby.commands = {
			// 	...ContextSchema.lobby.commands,
			// 	...COMMAND_INTERFACE.DOC.COMMANDS,
			// };
			return {
				LOCALES: undefined,
				SCHEMA: { ...COMMAND_INTERFACE.DOC.CONTEXTS } as IContextContainer,
				// SCHEMA: { ...ContextSchema, ...COMMAND_INTERFACE.DOC.CONTEXTS } as IContextContainer,
			};
		};

		const { LOCALES, SCHEMA } = prepareSchema();
		const cli = new ContextManager('cli').managerInstance;
		cli?.initialize(structuredClone(SCHEMA), structuredClone(LOCALES));

		const options = new ContextManager('options').managerInstance;
		options?.initialize(structuredClone(SCHEMA), structuredClone(LOCALES));

		return {
			cli,
			options,
		};
	}, []);

	const processResponse = (response?: IResponse) => {
		if (!response) return;

		const { success, actions, info } = response;
		let { message } = response;

		message = info?.command?.name ? `${message} (${info?.command?.name})` : message;

		if (!actions?.length) setScreenItem({ success, content: message });
		else actions?.forEach((action) => processAction(success, message, action));
	};

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
				<h2>Demos</h2>
				<div className={b('navigation-bar', 'options')}>
					<button onClick={() => onButtonClick('cli')}>CLI</button>
					<button onClick={() => onButtonClick('options')}>Options</button>
				</div>
			</div>
			<div className={b('demo-container')}>
				<ContentScreen messageItem={screenItem} className={selectedDemo} />
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
