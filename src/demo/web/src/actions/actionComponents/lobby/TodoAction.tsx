import ReactMarkdown from 'react-markdown';
import { CustomPreComponent } from '../../../components/shared/CustomPreComponent';
import remarkGfm from 'remark-gfm';

interface TodoActionProps {
	todoDocument: () => Promise<unknown>;
}

const TodoAction = async (props: TodoActionProps) => {
	const { todoDocument } = props;

	const content = (await todoDocument()) as string;

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

export default TodoAction;
