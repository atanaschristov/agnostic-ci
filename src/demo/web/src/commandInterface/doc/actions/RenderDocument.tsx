import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CustomPreComponent } from './CustomPreComponent';

interface IRenderDocumentParameter {
	docs?: Record<string, () => Promise<string>>;
	path?: string;
}

export const RenderDocument = async (props: IRenderDocumentParameter) => {
	const { docs, path } = props;

	const filtered = [];
	for (const [key, value] of Object.entries(docs || {})) {
		if (key.includes(path || '')) {
			filtered.push(value);
		}
	}

	if (filtered.length == 0) {
		console.warn('No documents found.');
		return <div>Documentation not found.</div>;
	}

	if (filtered.length > 0)
		console.warn('More than one doc found, showing the first one.', filtered);

	const content = await filtered[0]();

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
