import { ACTION_NAMES } from '../../../../__mocks__/contexts/';
// TODO from the library
import { IActionResponseParameter } from '../../../../lib/types';

import DocumentationEntryAction from './actionComponents/documentation/DocumentationEntryAction';
import ListDocumentsAction from './actionComponents/documentation/ListDocumentsAction';
import ShowDocumentAction from './actionComponents/documentation/ShowDocumentAction';
import TodoAction from './actionComponents/lobby/TodoAction';
import WelcomeScreenAction from './actionComponents/lobby/WelcomeScreenAction';

const docs = import.meta.glob('../../assets/documentation/*.md', {
	query: '?raw',
	import: 'default',
});
const todo = import.meta.glob('../../../../../TODO.md', { query: '?raw', import: 'default' });

export const ACTIONS = {
	['implicitlyExecuteHelpAction']: async (parameter?: IActionResponseParameter) => {
		return parameter?.value && <div style={{ whiteSpace: 'pre-wrap' }}>{parameter?.value}</div>;
	},
	[ACTION_NAMES.DOCUMENTATION.DOC_ENTRY]: async () => {
		return <DocumentationEntryAction />;
	},
	[ACTION_NAMES.DOCUMENTATION.LIST]: async () => {
		const paths = Object.keys(docs);

		return <ListDocumentsAction paths={paths} />;
	},
	[ACTION_NAMES.DOCUMENTATION.SHOW]: async (parameter: unknown) => {
		return await ShowDocumentAction({ docs, path: (parameter as { value?: string })?.value });
	},
	[ACTION_NAMES.LOBBY.LOBBY_WELCOME_SCREEN]: async () => {
		return <WelcomeScreenAction />;
	},
	[ACTION_NAMES.LOBBY.LOBBY_TODO]: async () => {
		return await TodoAction({ todoDocument: Object.values(todo)[0] });
	},
};
