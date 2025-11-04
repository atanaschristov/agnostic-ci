import { ACTION_NAMES } from '../../../../__mocks__/contexts/';
// TODO from the library
import { IActionResponseParameter } from '../../../../lib/types';
import { List } from '../components/documentation/List';
import { RenderDocument } from '../components/documentation/RenderDocument';

import DocumentationEntry from '../components/documentation/DocumentationEntry';
import TodoScreen from '../components/TodoScreen';
import WelcomeScreen from '../components/WelcomeScreen';

const docs = import.meta.glob('../../assets/documentation/*.md', { as: 'raw' });
const todo = import.meta.glob('../../../../../TODO.md', { as: 'raw' });

export const ACTIONS = {
	['implicitlyExecuteHelpAction']: async (parameter?: IActionResponseParameter) => {
		return parameter?.value && <div style={{ whiteSpace: 'pre-wrap' }}>{parameter?.value}</div>;
	},
	[ACTION_NAMES.DOCUMENTATION.DOC_ENTRY]: async () => {
		return <DocumentationEntry />;
	},
	[ACTION_NAMES.DOCUMENTATION.LIST]: async () => {
		const paths = Object.keys(docs);

		return <List paths={paths} />;
	},
	[ACTION_NAMES.DOCUMENTATION.SHOW]: async (parameter: unknown) => {
		return await RenderDocument({ docs, path: (parameter as { value?: string })?.value });
	},
	[ACTION_NAMES.LOBBY.LOBBY_WELCOME_SCREEN]: async () => {
		return <WelcomeScreen />;
	},
	[ACTION_NAMES.LOBBY.LOBBY_TODO]: async () => {
		return await TodoScreen({ todoDocument: Object.values(todo)[0] });
	},
};
