import { ACTION_NAMES } from '../constants';
import { List } from './List';
import { RenderDocument } from './RenderDocument';

const docs = import.meta.glob('../../../../assets/documentation/*.md', { as: 'raw' });

export const ACTIONS = {
	[ACTION_NAMES.LIST]: async () => {
		const paths = Object.keys(docs);

		return <List paths={paths} />;
	},
	[ACTION_NAMES.SHOW]: async (parameter: unknown) => {
		return await RenderDocument({ docs, path: (parameter as { value?: string })?.value });
	},
};
