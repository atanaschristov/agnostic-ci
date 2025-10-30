import { ACTION_NAMES } from '../../../../__mocks__/contexts/';
import { IActionResponseParameter } from 'agnostic-ci';
import { List } from '../components/documentation/List';
import { RenderDocument } from '../components/documentation/RenderDocument';

const docs = import.meta.glob('../../assets/documentation/*.md', { as: 'raw' });

export const ACTIONS = {
	['implicitlyExecuteHelpAction']: async (parameter?: IActionResponseParameter) => {
		return parameter?.value && <div style={{ whiteSpace: 'pre-wrap' }}>{parameter?.value}</div>;
	},
	[ACTION_NAMES.DOCUMENTATION.LIST]: async () => {
		const paths = Object.keys(docs);

		return <List paths={paths} />;
	},
	[ACTION_NAMES.DOCUMENTATION.SHOW]: async (parameter: unknown) => {
		return await RenderDocument({ docs, path: (parameter as { value?: string })?.value });
	},
};
