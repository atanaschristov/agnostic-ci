import ReactMarkdown from 'react-markdown';
import { CustomPreComponent } from './documentation/CustomPreComponent';
import remarkGfm from 'remark-gfm';

interface TODOScreenProps {
	todoDocument: () => Promise<string>;
}

const TodoScreen = async (props: TODOScreenProps) => {
	const { todoDocument } = props;

	const content = await todoDocument();

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

export default TodoScreen;
