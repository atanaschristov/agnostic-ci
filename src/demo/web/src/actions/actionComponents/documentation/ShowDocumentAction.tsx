import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CustomPreComponent } from '../../../components/shared/CustomPreComponent';

interface IRenderDocumentParameter {
	docs?: Record<string, () => Promise<unknown>>;
	path?: string;
}

const ShowDocumentAction = async (props: IRenderDocumentParameter) => {
	const { docs, path } = props;

	const filtered = [];
	if (isNaN(parseInt(path || '0'))) {
		for (const [key, value] of Object.entries(docs || {})) {
			if (key.includes(path || '')) {
				filtered.push(value);
			}
		}
	} else {
		const index = Number(path) - 1;
		filtered.push(Object.values(docs || {})[index >= 0 ? index : 0]);
	}

	if (filtered.length == 0) {
		return <div>Documentation not found.</div>;
	}

	const content = (await filtered[0]()) as string; // Get the first filtered element. Ignore the rest

	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				pre: CustomPreComponent as React.FC<React.HTMLAttributes<HTMLPreElement>>,
			}}
		>
			{content}
		</ReactMarkdown>
	);
};

export default ShowDocumentAction;
